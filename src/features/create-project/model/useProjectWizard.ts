import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import type { CreateProjectDto } from '@/entities/project/model/types';
import { useEffect, useState } from 'react';
import { PROJECT_LIMITS } from '@/shared/constants/projectLimits';
import { createCheckpointGroup, getCheckpointGroups } from '@/entities/checkpoint/api/requests';
import { mapDateToBackendString, parseDeadline } from '@/shared';

const { prd, lists, audience } = PROJECT_LIMITS;

export const createProjectRoleSchema = z.object({
  roleTypeId: z.string(),
  placesCount: z.number().min(1, 'Минимум мест должен быть не менее 1'),
  minPlacesCount: z.number().min(1, 'Минимум мест должен быть не менее 1'),
  meta: z.object({
    name: z.string(),
    description: z.string(),
  }),
  skills: z.array(z.object({ id: z.string(), skillName: z.string() })),
}).refine((data) => data.minPlacesCount <= data.placesCount, {
  message: 'Минимум мест не может быть больше максимума мест',
  path: ['minPlacesCount'],
});

export const baseProjectSchema = z.object({
  ownerId: z.number().min(1, 'ID владельца обязателен'),
  partnerId: z.string().min(1, 'Выберите партнера'),
  checkpoints: z.array(
    z.object({
      title: z.string().min(1, 'Укажите название'),
      deadline: z.string().min(1, 'Укажите дату и время'),
    })
  ).min(1, 'Укажите хотя бы одну ключевую точку'),
  links: z.array(
    z.object({
      name: z.string(),
      link: z.string().min(1, 'Укажите ссылку').url('Укажите корректную ссылку')
    })
  ).min(2, 'Выберите хотя бы по одной ссылке из обязательных блоков'),
  meta: z.object({
    title: z.string().min(PROJECT_LIMITS.meta.title.min, `Минимум ${PROJECT_LIMITS.meta.title.min} символов`).max(PROJECT_LIMITS.meta.title.max, `Максимум ${PROJECT_LIMITS.meta.title.max} символов`),
    description: z.string().min(PROJECT_LIMITS.meta.description.min, `Минимум ${PROJECT_LIMITS.meta.description.min} символов`).max(PROJECT_LIMITS.meta.description.max, `Максимум ${PROJECT_LIMITS.meta.description.max} символов`),
  }),
  roles: z.array(createProjectRoleSchema).min(1, 'Минимум 1 компетенция'),
  primaryTag: z.string().min(1, 'Выберите основной тег'),
  tags: z.array(
    z.string()).min(1, 'Выберите хотя бы один тег'),

  extraFieldsForAll:
    z.object({
      partnerName: z.string(),
      primaryTagName: z.string(),
      tags: z.array(z.string()),
    })
});

const audienceSegmentSchema = z.object({
  title: z.string().min(audience.title.min, 'Укажите название').max(audience.title.max, `Максимум ${audience.title.max} символов в названии аудитории`),
  description: z.string().min(audience.description.min, `Минимум ${audience.description.min} символов`).max(audience.description.max, `Максимум ${audience.description.max} символов`),
  minAge: z.number().min(audience.age.min, `Минимальный возраст должен быть не менее ${audience.age.min} года`),
  maxAge: z.number().max(audience.age.max, `Максимальный возраст должен быть не более ${audience.age.max} лет`),
});

const studyPrdSchema = z.object({
  prerequisites: z.string().min(prd.prerequisites.min, `Минимум ${prd.prerequisites.min} символов`).max(prd.prerequisites.max, `Максимум ${prd.prerequisites.max} символов`),
  projectGoal: z.string().min(prd.projectGoal.min, `Минимум ${prd.projectGoal.min} символов`).max(prd.projectGoal.max, `Максимум ${prd.projectGoal.max} символов`),
  keyFunctionality: z
    .array(z.string().min(lists.itemLength.min, `Минимум ${lists.itemLength.min} символов`).max(lists.itemLength.max, `Максимум ${lists.itemLength.max} символов`))
    .min(lists.count.min, `Добавьте минимум ${lists.count.min} функции`)
    .max(lists.count.max, `Максимум ${lists.count.max} функций`),
});

const casePrdSchema = z.object({
  prerequisites: z.string().min(prd.prerequisites.min, `Минимум ${prd.prerequisites.min} символов`).max(prd.prerequisites.max, `Максимум ${prd.prerequisites.max} символов`),
  audience: z.array(audienceSegmentSchema).min(audience.count.min, `Укажите хотя бы ${audience.count.min} сегмент аудитории`).max(audience.count.max, `Максимум ${audience.count.max} сегмента`),
  projectGoal: z.string().min(prd.projectGoal.min, `Минимум ${prd.projectGoal.min} символов`).max(prd.projectGoal.max, `Максимум ${prd.projectGoal.max} символов`),
  functional: z
    .array(z.string().min(lists.itemLength.min, `Минимум ${lists.itemLength.min} символов`).max(lists.itemLength.max, `Максимум ${lists.itemLength.max} символов`))
    .min(lists.count.min, `Функциональные требования обязательны (минимум ${lists.count.min})`)
    .max(lists.count.max, `Максимум ${lists.count.max} требований`),
  problemStatement: z.string().min(prd.problemStatement.min, `Минимум ${prd.problemStatement.min} символов`).max(prd.problemStatement.max, `Максимум ${prd.problemStatement.max} символов`),
});

const realPrdSchema = z.object({
  productVision: z.string().min(prd.productVision.min, `Минимум ${prd.productVision.min} символов`).max(prd.productVision.max, `Максимум ${prd.productVision.max} символов`),
  audience: z.array(audienceSegmentSchema).min(audience.count.min, `Укажите хотя бы ${audience.count.min} сегмент аудитории`).max(audience.count.max, `Максимум ${audience.count.max} сегмента`),
  projectGoal: z.string().min(prd.projectGoal.min, `Минимум ${prd.projectGoal.min} символов`).max(prd.projectGoal.max, `Максимум ${prd.projectGoal.max} символов`),
  businessGoal: z.string().min(prd.businessGoal.min, `Минимум ${prd.businessGoal.min} символов`).max(prd.businessGoal.max, `Максимум ${prd.businessGoal.max} символов`),
  functional: z
    .array(z.string().min(lists.itemLength.min, `Минимум ${lists.itemLength.min} символов`).max(lists.itemLength.max, `Максимум ${lists.itemLength.max} символов`))
    .min(lists.count.min, `Функциональные требования обязательны (минимум ${lists.count.min})`)
    .max(lists.count.max, `Максимум ${lists.count.max} требований`),
  nonFunctional: z
    .array(z.string().min(lists.itemLength.min, `Минимум ${lists.itemLength.min} символов`).max(lists.itemLength.max, `Максимум ${lists.itemLength.max} символов`))
    .min(lists.count.min, `Нефункциональные требования обязательны (минимум ${lists.count.min})`)
    .max(lists.count.max, `Максимум ${lists.count.max} требований`),
  businessMetrics: z
    .array(z.string().min(lists.itemLength.min, `Минимум ${lists.itemLength.min} символов`).max(lists.itemLength.max, `Максимум ${lists.itemLength.max} символов`))
    .min(lists.count.min, `Минимум ${lists.count.min} бизнес-метрики`)
    .max(lists.count.max, `Максимум ${lists.count.max} метрик`),
  projectPlan: z
    .array(z.string().min(PROJECT_LIMITS.projectPlan.itemLength.min, `Минимум ${PROJECT_LIMITS.projectPlan.itemLength.min} символов`).max(PROJECT_LIMITS.projectPlan.itemLength.max, `Максимум ${PROJECT_LIMITS.projectPlan.itemLength.max} символов`))
    .min(PROJECT_LIMITS.projectPlan.count.min, `Добавьте минимум ${PROJECT_LIMITS.projectPlan.count.min} пункт плана`)
    .max(PROJECT_LIMITS.projectPlan.count.max, `Максимум ${PROJECT_LIMITS.projectPlan.count.max} пунктов`),

});

export const createProjectSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('Study'), prdMeta: studyPrdSchema }).merge(baseProjectSchema),
  z.object({ type: z.literal('Case'), prdMeta: casePrdSchema }).merge(baseProjectSchema),
  z.object({ type: z.literal('Real'), prdMeta: realPrdSchema }).merge(baseProjectSchema),
]);

export type CreateProjectFormValues = z.infer<typeof createProjectSchema>;

export type CreateProjectForm = ReturnType<typeof useProjectWizard>['form'];

const step1Schema = z.object({
  meta: baseProjectSchema.shape.meta,
  primaryTag: baseProjectSchema.shape.primaryTag,
  tags: baseProjectSchema.shape.tags,
  partnerId: baseProjectSchema.shape.partnerId,
});

const step2Schema = z.object({
  prdMeta: z.union([studyPrdSchema, casePrdSchema, realPrdSchema]),
});

const step3Schema = z.object({
  roles: baseProjectSchema.shape.roles,
});

const step4Schema = z.object({
  checkpoints: baseProjectSchema.shape.checkpoints,
  links: baseProjectSchema.shape.links,
});

const STEP_SCHEMAS: Record<number, z.ZodTypeAny> = {
  1: step1Schema,
  2: step2Schema,
  3: step3Schema,
  4: step4Schema,
};

const TOTAL_STEPS = 5;

export type StepErrors = Record<string, string[]>;

interface UseProjectWizardProps {
  onSubmit: (values: CreateProjectDto) => void | Promise<void>;
  defaultValues?: Partial<CreateProjectFormValues>;
}

const STUDY_DEFAULTS: CreateProjectFormValues = {
  type: 'Study',
  ownerId: 1,
  partnerId: '',
  checkpoints: [{ title: '', deadline: '' }, { title: '', deadline: '' }, { title: '', deadline: '' }],
  meta: { title: '', description: '' },
  roles: [],
  primaryTag: '',
  tags: [],
  links: [],
  prdMeta: { prerequisites: '', projectGoal: '', keyFunctionality: ['', '', ''] },
  extraFieldsForAll: { partnerName: '', primaryTagName: '', tags: [] },
};

export const useProjectWizard = ({ onSubmit, defaultValues }: UseProjectWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [highestStep, setHighestStep] = useState(1);
  const [stepErrors, setStepErrors] = useState<StepErrors>({});
  const [blinkFields, setBlinkFields] = useState<string[]>([]);
  const [isRestored, setIsRestored] = useState(false);

  useEffect(() => {
    if (defaultValues && !isRestored) {
      const savedStep = (defaultValues as any).currentStep;
      const savedHighest = (defaultValues as any).highestStep;
      if (savedStep && savedHighest) {
        setCurrentStep(savedStep);
        setHighestStep(savedHighest);
        setIsRestored(true);
      }
    }
  }, [defaultValues, isRestored]);

  // Extract non-form fields so they don't get passed to useForm
  const { currentStep: _currentStep, highestStep: _highestStep, ...formDefaultValues } = (defaultValues || {}) as any;

  const form = useForm({
    // validatorAdapter: zodValidator(),
    validators: {
      onSubmit: createProjectSchema,
    },
    defaultValues: {
      ...STUDY_DEFAULTS,
      ...formDefaultValues,
    } as CreateProjectFormValues,

    onSubmit: async ({ value }) => {

      const cleanCheckpoints = value.checkpoints.map((cp) => {
        const { isImmutable, ...rest } = cp as { isImmutable?: boolean; title: string; deadline: string };
        return rest;
      });

      const checkpointId = await createCheckpointGroup({
        title: 'checkpoint',
        checkpoints: cleanCheckpoints.map(c => ({ title: c.title, deadline: parseDeadline(c.deadline)! }))
      })

      const payload = {
        type: value.type,
        partnerId: value.partnerId,
        checkpoints: checkpointId,
        meta: value.meta,
        primaryTagId: value.primaryTag,
        tagIds: value.tags?.length ? value.tags : [],
        prdMeta: value.prdMeta,
        roles: value.roles.map(role => ({
          roleTypeId: role.roleTypeId,
          placesCount: role.placesCount,
          minPlacesCount: role.minPlacesCount,
          skillIds: role.skills.map(skill => skill.id)
        })),
        // TODO: УБРАТЬ НАХУЙ ЭТО
        //ki5DpvbZds1wnCWP - repo
        // u7ZftcYmGyDauTWk - task

        repository: [
          {
            platformId: "ki5DpvbZds1wnCWP",
            url: "https://github.com/mock"
          }
        ],
        taskTracker: [
          {
            platformId: "u7ZftcYmGyDauTWk",
            url: "https://trello.com/mock"
          }
        ],
        designEnvironment: [
          {
            platformId: "a-qGXo4vvPS6lHex",
            url: "https://figma.com/mock"
          }
        ]
      } as unknown as CreateProjectDto;

      console.log('payload:', payload)
      await onSubmit(payload);
    },
  });

  useEffect(() => {
    const fetchDefaultCheckpoints = async () => {
      const backCheckpoints = await getCheckpointGroups(10, 0)
      const firstCheckpoints = backCheckpoints.checkpointGroups[0]?.checkpoints

      if (firstCheckpoints && firstCheckpoints.length > 0) {
        const immutableCheckpoints = firstCheckpoints.map(cp => ({
          title: cp.title,
          deadline: mapDateToBackendString(cp.deadline),
          isImmutable: true
        }))
        form.setFieldValue('checkpoints', immutableCheckpoints)
      }
    }

    fetchDefaultCheckpoints()
  }, [form]);

  useEffect(() => {
    const subscription = form.store.subscribe(() => {
      setStepErrors((prevErrors) => {
        if (Object.keys(prevErrors).length === 0) return prevErrors;

        const schema = STEP_SCHEMAS[currentStep];
        if (!schema) return prevErrors;

        const result = schema.safeParse(form.state.values);
        const newErrors: StepErrors = {};

        if (!result.success) {
          for (const issue of result.error.issues) {
            const key = issue.path.join('.');
            if (!newErrors[key]) newErrors[key] = [];
            newErrors[key].push(issue.message);
          }
        }

        let hasChanges = false;
        const nextErrors = { ...prevErrors };

        for (const key of Object.keys(prevErrors)) {
          if (!newErrors[key]) {
            delete nextErrors[key];
            hasChanges = true;
          } else if (JSON.stringify(prevErrors[key]) !== JSON.stringify(newErrors[key])) {
            nextErrors[key] = newErrors[key];
            hasChanges = true;
          }
        }

        return hasChanges ? nextErrors : prevErrors;
      });
    });

    return () => {
      if (typeof subscription === 'function') {
        (subscription as any)();
      } else if (subscription && typeof (subscription as any).unsubscribe === 'function') {
        (subscription as any).unsubscribe();
      }
    };
  }, [form.store, currentStep]);

  const validateCurrentStep = (): boolean => {
    const schema = STEP_SCHEMAS[currentStep];
    if (!schema) return true;

    const result = schema.safeParse(form.state.values);

    if (result.success) {
      setStepErrors({});
      return true;
    }

    const errors: StepErrors = {};
    for (const issue of result.error.issues) {
      const key = issue.path.join('.');
      if (!errors[key]) errors[key] = [];
      errors[key].push(issue.message);
    }
    setStepErrors(errors);
    return false;
  };

  const nextStep = () => {
    const isValid = validateCurrentStep();

    if (!isValid) return;
    setHighestStep((prev) => Math.max(prev, currentStep + 1));
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const prevStep = () => {
    setStepErrors({});
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  const setStep = (step: number) => {
    if (step > highestStep) return;

    if (step > currentStep) {
      if (!validateCurrentStep()) return;
    }

    setCurrentStep(step);
  };

  return { form, currentStep, stepErrors, highestStep, nextStep, prevStep, setStep, blinkFields, setBlinkFields };
};
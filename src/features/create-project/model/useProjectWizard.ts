import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import type { CreateProjectDto } from '@/entities/project/model/types';
import { useEffect, useState, useRef } from 'react';
import { PROJECT_LIMITS } from '@/shared/constants/projectLimits';
import { getCurrentCheckpoints } from '@/entities/checkpoint';
import { useMe } from '@/entities/user';
import { isSafeExternalUrl } from '@/shared';

const { prd, lists, audience } = PROJECT_LIMITS;

export const createProjectRoleSchema = z.object({
  roleTypeId: z.string(),
  placesCount: z.number().min(1, 'Минимум мест должен быть не менее 1'),
  minPlacesCount: z.number().min(0, 'Минимум мест должен быть не менее 0'),
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
  checkpoints: z.string().min(1, 'Базовые ключевые точки обязательны'),
  customCheckpoints: z.array(
    z.object({
      title: z.string().min(1, 'Укажите название'),
      deadline: z.string().min(1, 'Укажите дату и время'),
    })
  ),
  links: z.array(
    z.object({
      platformId: z.string(),
      name: z.string(),
      category: z.string(),
      // `.url()` пропускает javascript:/data: — дополнительно требуем http(s)
      link: z.string().min(1, 'Укажите ссылку').url('Укажите корректную ссылку')
        .refine(isSafeExternalUrl, 'Ссылка должна начинаться с http:// или https://')
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
  prerequisites: z.string().min(prd.prerequisites.min, `Минимум ${prd.prerequisites.min} символов`).max(prd.prerequisites.max, `Максимум ${prd.prerequisites.max} символов`),
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
  keyFunctionality: z
    .array(z.string().min(lists.itemLength.min, `Минимум ${lists.itemLength.min} символов`).max(lists.itemLength.max, `Максимум ${lists.itemLength.max} символов`))
    .min(lists.count.min, `Добавьте минимум ${lists.count.min} функции`)
    .max(lists.count.max, `Максимум ${lists.count.max} функций`),
  problemStatement: z.string().min(prd.problemStatement.min, `Минимум ${prd.problemStatement.min} символов`).max(prd.problemStatement.max, `Максимум ${prd.problemStatement.max} символов`),
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

const step2Schema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('Study'), prdMeta: studyPrdSchema }),
  z.object({ type: z.literal('Case'), prdMeta: casePrdSchema }),
  z.object({ type: z.literal('Real'), prdMeta: realPrdSchema }),
]);

const step3Schema = z.object({
  roles: baseProjectSchema.shape.roles,
});

const step4Schema = z.object({
  checkpoints: baseProjectSchema.shape.checkpoints,
  customCheckpoints: baseProjectSchema.shape.customCheckpoints,
  links: baseProjectSchema.shape.links,
});

const STEP_SCHEMAS: Record<number, z.ZodTypeAny> = {
  1: step1Schema,
  2: step2Schema,
  3: step3Schema,
  4: step4Schema,
};

import { calculateProjectWizardProgress, type WizardProgress, type WizardStepProgress } from './wizardProgress'
export { calculateProjectWizardProgress, type WizardProgress, type WizardStepProgress }

const TOTAL_STEPS = 5;

export type StepErrors = Record<string, string[]>;

interface UseProjectWizardProps {
  onSubmit: (values: CreateProjectDto) => void | Promise<void>;
  defaultValues?: Partial<CreateProjectFormValues> & {
    currentStep?: number;
    highestStep?: number;
    progress?: WizardProgress;
  };
  /** Значения черновика для явного восстановления. */
  restoreValues?: (Partial<CreateProjectFormValues> & {
    currentStep?: number;
    highestStep?: number;
    progress?: WizardProgress;
  }) | null;
  isDraftLoading?: boolean;
}

const STUDY_DEFAULTS = {
  type: 'Study',
  // Владелец — создающий куратор, не константа: захардкоженный «1» был
  // мёртвой валидацией сфабрикованного ID.
  ownerId: 0,
  partnerId: '',
  checkpoints: '',
  customCheckpoints: [],
  meta: { title: '', description: '' },
  roles: [],
  primaryTag: '',
  tags: [],
  links: [],
  prdMeta: {
    prerequisites: '',
    projectGoal: '',
    keyFunctionality: ['', ''],
  },
  extraFieldsForAll: { partnerName: '', primaryTagName: '', tags: [] },
} as CreateProjectFormValues;

export const useProjectWizard = ({ onSubmit, defaultValues, restoreValues, isDraftLoading }: UseProjectWizardProps) => {
  const { data: me } = useMe();

  const initialSource = defaultValues ?? restoreValues ?? null;
  const initialStep = (typeof initialSource?.currentStep === 'number' && initialSource.currentStep >= 1)
    ? initialSource.currentStep
    : 1;
  const initialHighest = (typeof initialSource?.highestStep === 'number' && initialSource.highestStep >= 1)
    ? initialSource.highestStep
    : 1;

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [highestStep, setHighestStep] = useState(initialHighest);
  const [stepErrors, setStepErrors] = useState<StepErrors>({});
  const [blinkFields, setBlinkFields] = useState<string[]>([]);
  const hasRestoredRef = useRef(false);

  // Create stable defaultValues ref to prevent formApi.update from clobbering restored state on re-renders
  const stableDefaultValuesRef = useRef<CreateProjectFormValues | null>(null);
  if (!stableDefaultValuesRef.current) {
    const src = defaultValues ?? restoreValues ?? {};
    const { currentStep: _c, highestStep: _h, progress: _p, ...fields } = src;
    stableDefaultValuesRef.current = {
      ...STUDY_DEFAULTS,
      ownerId: me ? Number(me.id) : 0,
      ...fields,
      meta: {
        ...STUDY_DEFAULTS.meta,
        ...(fields.meta || {}),
      },
      prdMeta: {
        ...STUDY_DEFAULTS.prdMeta,
        ...(fields.prdMeta || {}),
      },
      extraFieldsForAll: {
        ...STUDY_DEFAULTS.extraFieldsForAll,
        ...(fields.extraFieldsForAll || {}),
      },
    } as CreateProjectFormValues;
  }

  const form = useForm({
    // validatorAdapter: zodValidator(),
    validators: {
      onSubmit: createProjectSchema,
    },
    defaultValues: stableDefaultValuesRef.current,

    onSubmit: async ({ value }) => {
      const payload: CreateProjectDto = {
        type: value.type,
        ownerId: me ? Number(me.id) : 0,
        partnerId: value.partnerId,
        checkpoints: value.checkpoints,
        customCheckpoints: (value.customCheckpoints || []).map(c => ({
          title: c.title,
          deadline: c.deadline
        })),
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
        repository: value.links
          .filter(l => l.category === 'Repository')
          .map(l => ({ platformId: l.platformId, name: l.name, url: l.link })),
        taskTracker: value.links
          .filter(l => l.category === 'TaskTracker')
          .map(l => ({ platformId: l.platformId, name: l.name, url: l.link })),
        otherPlatforms: value.links
          .filter(l => l.category === 'OtherPlatforms' || (l.category as string) === 'DesignEnvironment')
          .map(l => ({ platformId: l.platformId, name: l.name, url: l.link }))
      } as CreateProjectDto;

      console.log('payload:', payload)
      await onSubmit(payload);
    },
  });

  useEffect(() => {
    if (!restoreValues || hasRestoredRef.current) {
      return;
    }

    hasRestoredRef.current = true;

    const {
      currentStep: savedStep,
      highestStep: savedHighest,
      progress: _progress,
      ...formValues
    } = restoreValues as Record<string, any>;

    const merged = {
      ...STUDY_DEFAULTS,
      ownerId: me ? Number(me.id) : 0,
      ...formValues,
      meta: {
        ...STUDY_DEFAULTS.meta,
        ...(formValues.meta || {}),
      },
      prdMeta: {
        ...STUDY_DEFAULTS.prdMeta,
        ...(formValues.prdMeta || {}),
      },
      extraFieldsForAll: {
        ...STUDY_DEFAULTS.extraFieldsForAll,
        ...(formValues.extraFieldsForAll || {}),
      },
    } as CreateProjectFormValues;

    // Update stableDefaultValuesRef and form.options so formApi.update cannot revert it
    stableDefaultValuesRef.current = merged;
    form.options.defaultValues = merged;

    form.reset(merged);

    // Also explicitly set all fields so mounted FieldApi instances update their stores
    Object.entries(merged).forEach(([key, val]) => {
      form.setFieldValue(key as any, val);
    });

    if (typeof savedStep === 'number' && savedStep >= 1) {
      setCurrentStep(savedStep);
    }
    if (typeof savedHighest === 'number' && savedHighest >= 1) {
      setHighestStep(savedHighest);
    }
  }, [restoreValues, form, me]);

  useEffect(() => {
    const fetchDefaultCheckpoints = async () => {
      // Пока загружается черновик, не подставляем дефолтные чекпоинты,
      // иначе setFieldValue спровоцирует перезапись черновика до его восстановления.
      if (isDraftLoading) return;

      try {
        const currentGroup = await getCurrentCheckpoints();
        if (currentGroup?.id) {
          form.setFieldValue('checkpoints', currentGroup.id);
        }
      } catch (e) {
        console.error('Failed to fetch current checkpoints:', e);
      }
    };

    fetchDefaultCheckpoints();
  }, [form, isDraftLoading]);

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
      // @ts-ignore - store subscription cleanup
      // @ts-ignore
      if (typeof subscription === 'function') subscription();
      // @ts-ignore
      else if (subscription?.unsubscribe) subscription.unsubscribe();
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

  const calculateProgress = (values?: Partial<CreateProjectFormValues>) =>
    calculateProjectWizardProgress(values || form.state.values);

  const getProgress = () => calculateProgress();

  return {
    form,
    currentStep,
    stepErrors,
    highestStep,
    nextStep,
    prevStep,
    setStep,
    blinkFields,
    setBlinkFields,
    progress: getProgress(),
    getProgress,
    calculateProgress,
  };
};
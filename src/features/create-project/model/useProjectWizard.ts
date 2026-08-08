import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import type { CreateProjectDto } from '@/entities/project/model/types';
import { projectApi } from '@/entities/project/api/requests';
import { useEffect, useState } from 'react';
import { PROJECT_LIMITS } from '@/shared/constants/projectLimits';

const { prd, lists, audience } = PROJECT_LIMITS;

export const createProjectRoleSchema = z.object({
  roleTypeId: z.string(),
  placesCount: z.number().min(1, 'Минимум мест должен быть не менее 1'),
  minPlacesCount: z.number().min(1, 'Минимум мест должен быть не менее 1'),
  meta: z.object({
    name: z.string(),
    description: z.string(),
  }),
  skills: z.array(z.object({ skillId: z.string(), skillName: z.string() })),
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
      deadline: z.string().min(1, 'Укажите дату'),
    })
  ),
  meta: z.object({
    title: z.string().min(PROJECT_LIMITS.meta.title.min, `Минимум ${PROJECT_LIMITS.meta.title.min} символов`).max(PROJECT_LIMITS.meta.title.max, `Максимум ${PROJECT_LIMITS.meta.title.max} символов`),
    description: z.string().min(PROJECT_LIMITS.meta.description.min, `Минимум ${PROJECT_LIMITS.meta.description.min} символов`).max(PROJECT_LIMITS.meta.description.max, `Максимум ${PROJECT_LIMITS.meta.description.max} символов`),
  }),
  roles: z.array(createProjectRoleSchema),
  primaryTag: z.string().min(1, 'Выберите основной тег'),
  tags: z.array(
    z.string()).min(1, 'Выберите хотя бы один тег'),
});

const audienceSegmentSchema = z.object({
  title: z.string().min(audience.title.min, 'Укажите название').max(audience.title.max, `Максимум ${audience.title.max} символов в названии аудитории`),
  // Исправлено: макс 200 символов согласно таблице
  description: z.string().min(audience.description.min, `Минимум ${audience.description.min} символов`).max(audience.description.max, `Максимум ${audience.description.max} символов`),
  minAge: z.number().min(audience.age.min, `Минимальный возраст должен быть не менее ${audience.age.min} года`),
  maxAge: z.number().max(audience.age.max, `Максимальный возраст должен быть не более ${audience.age.max} лет`),
});

const studyPrdSchema = z.object({
  prerequisites: z.string().min(prd.prerequisites.min, `Минимум ${prd.prerequisites.min} символов`).max(prd.prerequisites.max, `Максимум ${prd.prerequisites.max} символов`),
  projectGoal: z.string().min(prd.projectGoal.min, `Минимум ${prd.projectGoal.min} символов`).max(prd.projectGoal.max, `Максимум ${prd.projectGoal.max} символов`),
  keyFunctionality: z
    // Исправлено: текст 50-200 символов, массив 2-12 пунктов
    .array(z.string().min(lists.itemLength.min, `Минимум ${lists.itemLength.min} символов`).max(lists.itemLength.max, `Максимум ${lists.itemLength.max} символов`))
    .min(lists.count.min, `Добавьте минимум ${lists.count.min} функции`)
    .max(lists.count.max, `Максимум ${lists.count.max} функций`),
});

const casePrdSchema = z.object({
  // Исправлено: добавлены лимиты 200-600 символов для предпосылок
  prerequisites: z.string().min(prd.prerequisites.min, `Минимум ${prd.prerequisites.min} символов`).max(prd.prerequisites.max, `Максимум ${prd.prerequisites.max} символов`),
  // Ограничиваем массив аудитории до 3 сегментов
  audience: z.array(audienceSegmentSchema).min(audience.count.min, `Укажите хотя бы ${audience.count.min} сегмент аудитории`).max(audience.count.max, `Максимум ${audience.count.max} сегмента`),
  projectGoal: z.string().min(prd.projectGoal.min, `Минимум ${prd.projectGoal.min} символов`).max(prd.projectGoal.max, `Максимум ${prd.projectGoal.max} символов`),
  functional: z
    // Исправлено: текст 50-200 символов, массив 2-12 пунктов
    .array(z.string().min(lists.itemLength.min, `Минимум ${lists.itemLength.min} символов`).max(lists.itemLength.max, `Максимум ${lists.itemLength.max} символов`))
    .min(lists.count.min, `Функциональные требования обязательны (минимум ${lists.count.min})`)
    .max(lists.count.max, `Максимум ${lists.count.max} требований`),
  problemStatement: z.string().min(prd.problemStatement.min, `Минимум ${prd.problemStatement.min} символов`).max(prd.problemStatement.max, `Максимум ${prd.problemStatement.max} символов`),
});

const realPrdSchema = z.object({
  productVision: z.string().min(prd.productVision.min, `Минимум ${prd.productVision.min} символов`).max(prd.productVision.max, `Максимум ${prd.productVision.max} символов`),
  // Ограничиваем массив аудитории до 3 сегментов
  audience: z.array(audienceSegmentSchema).min(audience.count.min, `Укажите хотя бы ${audience.count.min} сегмент аудитории`).max(audience.count.max, `Максимум ${audience.count.max} сегмента`),
  projectGoal: z.string().min(prd.projectGoal.min, `Минимум ${prd.projectGoal.min} символов`).max(prd.projectGoal.max, `Максимум ${prd.projectGoal.max} символов`),
  businessGoal: z.string().min(prd.businessGoal.min, `Минимум ${prd.businessGoal.min} символов`).max(prd.businessGoal.max, `Максимум ${prd.businessGoal.max} символов`),
  functional: z
    // Исправлено: текст 50-200 символов, массив 2-12 пунктов
    .array(z.string().min(lists.itemLength.min, `Минимум ${lists.itemLength.min} символов`).max(lists.itemLength.max, `Максимум ${lists.itemLength.max} символов`))
    .min(lists.count.min, `Функциональные требования обязательны (минимум ${lists.count.min})`)
    .max(lists.count.max, `Максимум ${lists.count.max} требований`),
  nonFunctional: z
    // Исправлено: текст 50-200 символов, массив 2-12 пунктов
    .array(z.string().min(lists.itemLength.min, `Минимум ${lists.itemLength.min} символов`).max(lists.itemLength.max, `Максимум ${lists.itemLength.max} символов`))
    .min(lists.count.min, `Нефункциональные требования обязательны (минимум ${lists.count.min})`)
    .max(lists.count.max, `Максимум ${lists.count.max} требований`),
  businessMetrics: z
    // Исправлено: массив 2-12 пунктов
    .array(z.string().min(lists.itemLength.min, `Минимум ${lists.itemLength.min} символов`).max(lists.itemLength.max, `Максимум ${lists.itemLength.max} символов`))
    .min(lists.count.min, `Минимум ${lists.count.min} бизнес-метрики`)
    .max(lists.count.max, `Максимум ${lists.count.max} метрик`),
  projectPlan: z
    // Исправлено: текст 100-400 символов
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

// Шаг 1: основная инфо (название, описание, теги, партнёр)
const step1Schema = z.object({
  meta: baseProjectSchema.shape.meta,
  primaryTag: baseProjectSchema.shape.primaryTag,
  tags: baseProjectSchema.shape.tags,
  partnerId: baseProjectSchema.shape.partnerId,
});

// Шаг 2: PRD (зависит от type)
const step2Schema = z.object({
  prdMeta: z.union([studyPrdSchema, casePrdSchema, realPrdSchema]),
});

// Шаг 3: роли и чекпоинты
const step3Schema = z.object({
  roles: baseProjectSchema.shape.roles,
  checkpoints: baseProjectSchema.shape.checkpoints,
});

const STEP_SCHEMAS: Record<number, z.ZodTypeAny> = {
  1: step1Schema,
  2: step2Schema,
  3: step3Schema,
};

const TOTAL_STEPS = 5;

/** Плоский словарь ошибок: путь поля -> список сообщений */
export type StepErrors = Record<string, string[]>;

interface UseProjectWizardProps {
  onSubmit: (values: CreateProjectDto) => void | Promise<void>;
  defaultValues?: Partial<CreateProjectFormValues>;
}

const STUDY_DEFAULTS: CreateProjectFormValues = {
  type: 'Study',
  ownerId: 1,
  partnerId: '',
  checkpoints: [{ title: '', deadline: '' }],
  meta: { title: '', description: '' },
  roles: [],
  primaryTag: '',
  tags: [],
  prdMeta: { prerequisites: '', projectGoal: '', keyFunctionality: ['', '', ''] },
};

export const useProjectWizard = ({ onSubmit, defaultValues }: UseProjectWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepErrors, setStepErrors] = useState<StepErrors>({});

  const form = useForm({
    // validatorAdapter: zodValidator(),
    validators: {
      onSubmit: createProjectSchema,
    },
    defaultValues: {
      ...STUDY_DEFAULTS,
      ...defaultValues,
    } as CreateProjectFormValues,

    onSubmit: async ({ value }) => {

      // Убираем вспомогательный флаг isImmutable перед отправкой на сервер
      const cleanCheckpoints = value.checkpoints.map((cp) => {
        const { isImmutable, ...rest } = cp as { isImmutable?: boolean; title: string; deadline: string };
        return rest;
      });

      const { checkpointId } = await projectApi.createCheckpoints({
        name: "checkpoint",
        checkpoints: cleanCheckpoints
      } as Omit<Parameters<typeof projectApi.createCheckpoints>[0], 'id'> & { id?: string })

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
          meta: {
            description: "Бла бла"
          },
          skillIds: role.skills.map(skill => skill.skillId)
        })),
      } as unknown as CreateProjectDto;

      console.log('payload:', payload)
      await onSubmit(payload);
    },
  });

  useEffect(() => {
    const fetchDefaultCheckpoints = async () => {
      const backCheckpoints = await projectApi.getCheckpoints()
      const firstCheckpoints = backCheckpoints.checkpoints[0]?.checkpoints;

      if (firstCheckpoints && firstCheckpoints.length > 0) {
        const immutableCheckpoints = firstCheckpoints.map((cp: { title: string; deadline: string }) => ({ ...cp, isImmutable: true }));
        form.setFieldValue('checkpoints', immutableCheckpoints);
      }
    }

    fetchDefaultCheckpoints()
  }, [form]);

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
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const prevStep = () => {
    setStepErrors({});
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  return { form, currentStep, stepErrors, nextStep, prevStep, setStep: setCurrentStep };
};
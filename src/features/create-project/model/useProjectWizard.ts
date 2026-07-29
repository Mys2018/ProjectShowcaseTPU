import { useForm } from '@tanstack/react-form';
// import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';
import type { CreateProjectDto } from '@/entities/project/model/types';
import { projectApi } from '@/entities/project/api/requests';
import { useState } from 'react';

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
  checkpoints: z.string(),
  meta: z.object({
    title: z.string().min(35, 'Минимум 35 символов').max(100, 'Максимум 100 символов'),
    description: z.string().min(100, 'Минимум 100 символов').max(500, 'Максимум 500 символов'),
  }),
  roles: z.array(createProjectRoleSchema),
  primaryTag: z.string().min(1, 'Выберите основной тег'),
  tags: z.array(z.string()).min(1, 'Выберите хотя бы один тег'),
});

const audienceSegmentSchema = z.object({
  title: z.string().min(1, 'Укажите название').max(70, 'Максимум 70 символов в названии аудитории'),
  description: z.string().min(50, 'Минимум 50 символов').max(500, 'Максимум 500 символов'),
  minAge: z.number().min(1, 'Минимальный возраст должен быть не менее 1 года'),
  maxAge: z.number().max(100, 'Максимальный возраст должен быть не более 100 лет'),
});

const studyPrdSchema = z.object({
  prerequisites: z.string().min(200, 'Минимум 200 символов'),
  projectGoal: z.string().min(100, 'Минимум 100 символов'),
  keyFunctionality: z
    .array(z.string().min(30, 'Минимум 30 символов').max(300, 'Максимум 300 символов'))
    .min(1, 'Добавьте минимум одну функцию'),
});

const casePrdSchema = z.object({
  prerequisites: z.string().min(1, 'Укажите актуальность'),
  audience: z.array(audienceSegmentSchema).min(1, 'Укажите хотя бы один сегмент аудитории'),
  projectGoal: z.string().min(100, 'Минимум 100 символов').max(500, 'Максимум 500 символов'),
  functional: z
    .array(z.string().min(50, 'Минимум 50 символов').max(600, 'Максимум 600 символов'))
    .min(1, 'Функциональные требования обязательны'),
  problemStatement: z.string().min(100, 'Минимум 100 символов').max(1500, 'Максимум 1500 символов'),
});

const realPrdSchema = z.object({
  productVision: z.string().min(100, 'Минимум 100 символов').max(500, 'Максимум 500 символов'),
  audience: z.array(audienceSegmentSchema).min(1, 'Укажите хотя бы один сегмент аудитории'),
  projectGoal: z.string().min(100, 'Минимум 100 символов').max(500, 'Максимум 500 символов'),
  businessGoal: z.string().min(100, 'Минимум 100 символов').max(500, 'Максимум 500 символов'),
  functional: z
    .array(z.string().min(50, 'Минимум 50 символов').max(600, 'Максимум 600 символов'))
    .min(1, 'Функциональные требования обязательны'),
  nonFunctional: z
    .array(z.string().min(50, 'Минимум 50 символов').max(600, 'Максимум 600 символов'))
    .min(1, 'Нефункциональные требования обязательны'),
  businessMetrics: z
    .array(z.string().min(50, 'Минимум 50 символов').max(200, 'Максимум 200 символов'))
    .min(1, 'Минимум одна бизнес-метрика обязательна'),
  projectPlan: z
    .array(z.string().min(50, 'Минимум 50 символов').max(600, 'Максимум 600 символов'))
    .min(1, 'Добавьте минимум один пункт плана'),
});

export const createProjectSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('Study'), prdMeta: studyPrdSchema }).merge(baseProjectSchema),
  z.object({ type: z.literal('Case'), prdMeta: casePrdSchema }).merge(baseProjectSchema),
  z.object({ type: z.literal('Real'), prdMeta: realPrdSchema }).merge(baseProjectSchema),
]);

export type CreateProjectFormValues = z.infer<typeof createProjectSchema>;

export type CreateProjectForm = ReturnType<typeof useProjectWizard>['form'];


// ---------------------------------------------------------------------------
// Схемы валидации по шагам — только поля текущего шага
// ---------------------------------------------------------------------------

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
  checkpoints: '',
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
      // Подставляем дефолтные значения, если данные о таймингах и ролях не заполнены
      const mappedRoles = value.roles?.length && value.roles[0]?.roleTypeId !== '' ? value.roles : [
        {
          roleTypeId: 'v-Y51E1S1Oyux8gX',
          placesCount: 2,
          minPlacesCount: 1,
          meta: {
            description: 'Роль'
          },
          skills: [],
        }
      ];

      let checkpointId = value.checkpoints;
      if (!checkpointId) {
        try {
          const mockCheckpoints = await projectApi.createCheckpoints({
            name: 'Базовый план проекта',
            checkpoints: [
              { title: 'Старт проекта', deadline: new Date(Date.now() + 86400000).toISOString().split('T')[0] },
              { title: 'MVP', deadline: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0] },
              { title: 'Финал', deadline: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0] },
            ]
          });
          checkpointId = mockCheckpoints.checkpointId;
        } catch (e) {
          console.error('Failed to create mock checkpoints', e);
          checkpointId = 'QPpvJg9aMyU5o2-q';
        }
      }

      const payload = {
        type: value.type,
        partnerId: value.partnerId || 'wn8s6ctv',
        checkpoints: checkpointId,
        meta: value.meta,
        primaryTagId: value.primaryTag || 'SnJ8BpqPnxvMbtjT',
        tagIds: value.tags?.length ? value.tags : [],
        prdMeta: value.prdMeta,
        roles: mappedRoles.map(role => ({
          roleTypeId: role.roleTypeId || 'v-Y51E1S1Oyux8gX',
          placesCount: role.placesCount,
          minPlacesCount: role.minPlacesCount,
          meta: { description: role.meta.description || 'Описание роли' },
          skillIds: role.skills?.map((s: any) => s?.skillId || s?.id || s) || [],
        })),
      } as unknown as CreateProjectDto;

      console.log('🚀 ~ useProjectWizard ~ payload:', payload)
      await onSubmit(payload);
    },
  });

  const validateCurrentStep = (): boolean => {
    const schema = STEP_SCHEMAS[currentStep];
    if (!schema) return true; // шаг без схемы — пропускаем

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
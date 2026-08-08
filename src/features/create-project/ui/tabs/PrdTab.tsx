import type { CreateProjectForm, StepErrors } from '../../model/useProjectWizard';
import { BigTextFieldForm } from '@/shared/ui/fields/text-field/TextField.tsx';
import { TargetAudienceList } from '../components/TargetAudienceList';
import { RequirementList } from '../components/RequirementList';
import styles from './Tabs.module.css'
import { PROJECT_LIMITS } from '@/shared/constants/projectLimits';

interface PrdFieldProps {
  form: CreateProjectForm;
  stepErrors: StepErrors;
}

const getErrorMessage = (error: unknown): string | undefined => {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return undefined;
};

export function PrdTab({ form, stepErrors }: PrdFieldProps) {
  const type = form.state.values.type;

  return (
    <div className={styles.mainFieldContainer}>
      <div className={styles.mainInfo}>
        <h3>
          Требования к продукту (PRD)
        </h3>
        <p>
          Количество требований определяется типом проекта
        </p>
      </div>

      {type === 'Study' && <StudyPrdFields form={form} stepErrors={stepErrors} />}
      {type === 'Case' && <CasePrdFields form={form} stepErrors={stepErrors} />}
      {type === 'Real' && <RealPrdFields form={form} stepErrors={stepErrors} />}

    </div>
  );
}

function StudyPrdFields({ form, stepErrors }: PrdFieldProps) {
  return (
    <div className={styles.mainFieldContainer}>
      <div className={styles.block}>
        <h4 className={styles.title}>
          1. Актуальность
        </h4>
        <form.Field name="prdMeta.prerequisites">
          {(field) => (
            <BigTextFieldForm
              placeholder="Опишите основные причины..."
              value={field.state.value as string}
              onChange={(e) => field.handleChange(e.target.value)}
              maxLength={PROJECT_LIMITS.prd.prerequisites.max}
              validError={getErrorMessage(field.state.meta.errors[0]) || stepErrors['prdMeta.prerequisites']?.[0]}
            />
          )}
        </form.Field>
      </div>

      <div className={styles.block}>
        <h4 className={styles.title}>
          2. Цели
        </h4>
        <form.Field name="prdMeta.projectGoal">
          {(field) => (
            <BigTextFieldForm
              placeholder={"Что да как кратенько..."}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              maxLength={PROJECT_LIMITS.prd.projectGoal.max}
              validError={getErrorMessage(field.state.meta.errors[0]) || stepErrors['prdMeta.projectGoal']?.[0]}
            />
          )}
        </form.Field>
      </div>

      <div className={styles.block}>
        <h4 className={styles.title}>
          3. Требования
        </h4>
        <RequirementList
          form={form}
          stepErrors={stepErrors}
          name="prdMeta.keyFunctionality"
          title="Ключевой функционал"
          placeholder="Что да как кратенько..."
          maxLength={PROJECT_LIMITS.lists.itemLength.max}
        />
      </div>
    </div>
  );
}

function CasePrdFields({ form, stepErrors }: PrdFieldProps) {
  return (
    <div className={styles.mainFieldContainer}>
      <div className={styles.block}>
        <h4 className={styles.title}>
          1. Актуальность
        </h4>
        <form.Field name="prdMeta.prerequisites">
          {(field) => (
            <BigTextFieldForm
              placeholder="Опишите основные причины..."
              value={field.state.value as string}
              onChange={(e) => field.handleChange(e.target.value)}
              maxLength={PROJECT_LIMITS.prd.prerequisites.max}
              validError={getErrorMessage(field.state.meta.errors[0]) || stepErrors['prdMeta.prerequisites']?.[0]}
            />
          )}
        </form.Field>
      </div>


      <div className={styles.block}>
        <h4 className={styles.title}>
          2. Целевая аудитория
        </h4>
        <TargetAudienceList form={form} stepErrors={stepErrors} />
      </div>

      <div className={styles.block}>
        <h4 className={styles.title}>
          3. Цели
        </h4>
        <form.Field name="prdMeta.projectGoal">
          {(field) => (
            <BigTextFieldForm
              placeholder="Что да как кратенько..."
              value={field.state.value as string}
              onChange={(e) => field.handleChange(e.target.value)}
              maxLength={PROJECT_LIMITS.prd.projectGoal.max}
              validError={getErrorMessage(field.state.meta.errors[0]) || stepErrors['prdMeta.projectGoal']?.[0]}
            />
          )}
        </form.Field>
      </div>



      <div className={styles.block}>
        <h4 className={styles.title}>
          4. Требования
        </h4>
        <RequirementList
          form={form}
          stepErrors={stepErrors}
          name="prdMeta.functional"
          title="Функциональные требования"
          placeholder="Что да как кратенько..."
          maxLength={PROJECT_LIMITS.lists.itemLength.max}
        />
      </div>

      <div className={styles.block}>
        <h4 className={styles.title}>
          5. Реализация
        </h4>
        <form.Field name="prdMeta.problemStatement">
          {(field) => (
            <BigTextFieldForm
              subtitle={"Постановка задачи..."}
              placeholder="Что да как кратенько..."
              value={field.state.value as string}
              onChange={(e) => field.handleChange(e.target.value)}
              maxLength={PROJECT_LIMITS.prd.problemStatement.max}
              validError={getErrorMessage(field.state.meta.errors[0]) || stepErrors['prdMeta.problemStatement']?.[0]}
            />
          )}
        </form.Field>
      </div>


    </div>
  );
}

function RealPrdFields({ form, stepErrors }: PrdFieldProps) {
  return (
    <div className={styles.mainFieldContainer}>
      <div className={styles.block}>
        <h4 className={styles.title}>
          1. Product vision
        </h4>
        <form.Field name="prdMeta.productVision">
          {(field) => (
            <BigTextFieldForm
              placeholder="Расскажите стратегическое описание продукта..."
              value={field.state.value as string}
              onChange={(e) => field.handleChange(e.target.value)}
              maxLength={PROJECT_LIMITS.prd.productVision.max}
              validError={getErrorMessage(field.state.meta.errors[0]) || stepErrors['prdMeta.productVision']?.[0]}
            />
          )}
        </form.Field>
      </div>

      <div className={styles.block}>
        <h4 className={styles.title}>
          2. Целевая аудитория
        </h4>
        <TargetAudienceList form={form} stepErrors={stepErrors} />
      </div>

      <div className={styles.block}>
        <h4 className={styles.title}>
          3. Цели
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <form.Field name="prdMeta.projectGoal">
            {(field) => (
              <BigTextFieldForm
                subtitle={"Цель проекта..."}
                placeholder={"Что да как кратенько..."}
                value={field.state.value as string}
                onChange={(e) => field.handleChange(e.target.value)}
                maxLength={PROJECT_LIMITS.prd.projectGoal.max}
                validError={getErrorMessage(field.state.meta.errors[0]) || stepErrors['prdMeta.projectGoal']?.[0]}
              />
            )}
          </form.Field>
          <form.Field name="prdMeta.businessGoal">
            {(field) => (
              <BigTextFieldForm
                subtitle={"Цель бизнеса..."}
                placeholder={"Что да как кратенько..."}
                value={field.state.value as string}
                onChange={(e) => field.handleChange(e.target.value)}
                maxLength={PROJECT_LIMITS.prd.businessGoal.max}
                validError={getErrorMessage(field.state.meta.errors[0]) || stepErrors['prdMeta.businessGoal']?.[0]}
              />
            )}
          </form.Field>
        </div>
      </div>

      <div className={styles.block}>
        <h4 className={styles.title}>
          4. Требования
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <RequirementList
            form={form}
            stepErrors={stepErrors}
            name="prdMeta.functional"
            title="Функциональные требования"
            placeholder="Что да как кратенько..."
            maxLength={PROJECT_LIMITS.lists.itemLength.max}
          />
          <RequirementList
            form={form}
            stepErrors={stepErrors}
            name="prdMeta.nonFunctional"
            title="Нефункциональные требования"
            placeholder="Что да как кратенько..."
            maxLength={PROJECT_LIMITS.lists.itemLength.max}
          />
        </div>
      </div>

      <div className={styles.block}>
        <h4 className={styles.title}>
          5. Бизнес метрики
        </h4>
        <RequirementList
          form={form}
          stepErrors={stepErrors}
          name="prdMeta.businessMetrics"
          placeholder="Что да как кратенько..."
          maxLength={PROJECT_LIMITS.lists.itemLength.max}
        />
      </div>

      <div className={styles.block}>
        <h4 className={styles.title}>
          6. План проекта
        </h4>
        <RequirementList
          form={form}
          stepErrors={stepErrors}
          name="prdMeta.projectPlan"
          placeholder="Что да как кратенько..."
          maxLength={PROJECT_LIMITS.projectPlan.itemLength.max}
        />
      </div>
    </div>
  );
}

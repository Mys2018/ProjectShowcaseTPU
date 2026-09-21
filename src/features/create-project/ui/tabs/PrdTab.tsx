import type { CreateProjectForm, StepErrors } from '../../model/useProjectWizard';
import { TargetAudienceList } from '../components/target-audience/TargetAudienceList.tsx';
import { RequirementList } from '../components/requirement-list/RequirementList.tsx';
import styles from './Tabs.module.css'
import { BigTextFieldForm } from '@/shared/ui/fields/text-field/TextField.tsx';
import { PROJECT_LIMITS } from '@/shared/constants/projectLimits';
import { InfoTooltip } from "@/shared";

interface PrdFieldProps {
  form: CreateProjectForm;
  stepErrors: StepErrors;
  blinkFields: string[];
}

const getErrorMessage = (error: unknown): string | undefined => {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return undefined;
};

export function PrdTab({ form, stepErrors, blinkFields }: PrdFieldProps) {
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

      {type === 'Study' && <StudyPrdFields form={form} stepErrors={stepErrors} blinkFields={blinkFields} />}
      {type === 'Case' && <CasePrdFields form={form} stepErrors={stepErrors} blinkFields={blinkFields} />}
      {type === 'Real' && <RealPrdFields form={form} stepErrors={stepErrors} blinkFields={blinkFields} />}

    </div>
  );
}

function StudyPrdFields({ form, stepErrors, blinkFields }: PrdFieldProps) {
  return (
    <div className={styles.mainFieldContainer}>
      <div className={styles.block} id="field-prd-prerequisites">
        <h4 className={styles.title}>
          1. Предпосылки
          <InfoTooltip
            className={styles.tooltip}
            iconClassName={styles.tooltipIcon}
            title="Заголовок тултипа"
            body={
              [
                {
                  text: [
                    'Бла бла',
                  ]
                },
              ]
            }
            size={'small'}
            pointer={'topLeft'}
            importantText={'Важно тут!'}
            link={'sdfsdsdsds'}
            type={'bulb'}
          />
        </h4>
        <form.Field name="prdMeta.prerequisites">
          {(field) => (
            <BigTextFieldForm
              placeholder="Текущая ситуация в бизнесе и основные проблемы"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              maxLength={PROJECT_LIMITS.prd.prerequisites.max}
              validError={getErrorMessage(field.state.meta.errors[0]) || stepErrors['prdMeta.prerequisites']?.[0]}
              isBlink={blinkFields.includes('Актуальность')}
            />
          )}
        </form.Field>
      </div>

      <div className={styles.blockBig}>
        <h4 className={styles.title}>
          2. Цели
          <InfoTooltip
            className={styles.tooltip}
            iconClassName={styles.tooltipIcon}
            title="Заголовок тултипа"
            body={
              [
                {
                  text: [
                    'Бла бла',
                  ]
                },
              ]
            }
            size={'small'}
            pointer={'topLeft'}
            importantText={'Важно тут!'}
            link={'sdfsdsdsds'}
            type={'bulb'}
          />
        </h4>
        <form.Field name="prdMeta.projectGoal">
          {(field) => (
            <BigTextFieldForm
              placeholder={"Главный результат проекта"}
              title="2.1 Цель проекта"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              maxLength={PROJECT_LIMITS.prd.projectGoal.max}
              validError={getErrorMessage(field.state.meta.errors[0]) || stepErrors['prdMeta.projectGoal']?.[0]}
              isBlink={blinkFields.includes('Цель проекта')}
            />
          )}
        </form.Field>
      </div>

      <div className={styles.blockBig}>
        <h4 className={styles.title}>
          3. Требования
          <InfoTooltip
            className={styles.tooltip}
            iconClassName={styles.tooltipIcon}
            title="Заголовок тултипа"
            body={
              [
                {
                  text: [
                    'Бла бла',
                  ]
                },
              ]
            }
            size={'small'}
            pointer={'topLeft'}
            importantText={'Важно тут!'}
            link={'sdfsdsdsds'}
            type={'bulb'}
          />
        </h4>
        <RequirementList
          form={form}
          stepErrors={stepErrors}
          name="prdMeta.keyFunctionality"
          title="3.1 Ключевой функционал"
          minItems={2}
          placeholder="Что да как кратенько..."
          maxLength={PROJECT_LIMITS.lists.itemLength.max}
          isBlink={blinkFields.includes('Ключевой функционал')}
        />
      </div>
    </div>
  );
}

function CasePrdFields({ form, stepErrors, blinkFields }: PrdFieldProps) {
  return (
    <div className={styles.mainFieldContainer}>
      <div className={styles.block} id="field-prd-case-prerequisites">
        <h4 className={styles.title}>
          1. Предпосылки
          <InfoTooltip
            className={styles.tooltip}
            iconClassName={styles.tooltipIcon}
            title="Заголовок тултипа"
            body={
              [
                {
                  text: [
                    'Бла бла',
                  ]
                },
              ]
            }
            size={'small'}
            pointer={'topLeft'}
            importantText={'Важно тут!'}
            link={'sdfsdsdsds'}
            type={'bulb'}
          />
        </h4>
        <form.Field name="prdMeta.prerequisites">
          {(field) => (
            <BigTextFieldForm
              placeholder="Текущая ситуация в бизнесе и основные проблемы"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              maxLength={PROJECT_LIMITS.prd.prerequisites.max}
              validError={getErrorMessage(field.state.meta.errors[0]) || stepErrors['prdMeta.prerequisites']?.[0]}
              isBlink={blinkFields.includes('Актуальность')}
            />
          )}
        </form.Field>
      </div>


      <div className={styles.blockBig} id="field-prd-case-audience">
        <h4 className={styles.title}>
          2. Целевая аудитория
          <InfoTooltip
            className={styles.tooltip}
            iconClassName={styles.tooltipIcon}
            title="Заголовок тултипа"
            body={
              [
                {
                  text: [
                    'Бла бла',
                  ]
                },
              ]
            }
            size={'small'}
            pointer={'topLeft'}
            importantText={'Важно тут!'}
            link={'sdfsdsdsds'}
            type={'bulb'}
          />
        </h4>
        <TargetAudienceList form={form} stepErrors={stepErrors} blinkFields={blinkFields} />
      </div>

      <div className={styles.blockBig}>
        <h4 className={styles.title}>
          3. Цели
          <InfoTooltip
            className={styles.tooltip}
            iconClassName={styles.tooltipIcon}
            title="Заголовок тултипа"
            body={
              [
                {
                  text: [
                    'Бла бла',
                  ]
                },
              ]
            }
            size={'small'}
            pointer={'topLeft'}
            importantText={'Важно тут!'}
            link={'sdfsdsdsds'}
            type={'bulb'}
          />
        </h4>
        <form.Field name="prdMeta.projectGoal">
          {(field) => (
            <BigTextFieldForm
              placeholder="Главный результат проекта"
              title={'3.1 Цель проекта'}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              maxLength={PROJECT_LIMITS.prd.projectGoal.max}
              isBlink={blinkFields.includes('Цель проекта')}
            />
          )}
        </form.Field>
      </div>



      <div className={styles.blockBig} id="field-prd-case-functional">
        <h4 className={styles.title}>
          4. Требования
          <InfoTooltip
            className={styles.tooltip}
            iconClassName={styles.tooltipIcon}
            title="Заголовок тултипа"
            body={
              [
                {
                  text: [
                    'Бла бла',
                  ]
                },
              ]
            }
            size={'small'}
            pointer={'topLeft'}
            importantText={'Важно тут!'}
            link={'sdfsdsdsds'}
            type={'bulb'}
          />
        </h4>
        <RequirementList
          form={form}
          stepErrors={stepErrors}
          name="prdMeta.functional"
          title="4.1 Функциональные требования"
          placeholder="Что да как кратенько..."
          minItems={2}
          maxLength={PROJECT_LIMITS.lists.itemLength.max}
          isBlink={blinkFields.includes('Функциональные требования')}
        />
      </div>

      <div className={styles.blockBig}>
        <h4 className={styles.title}>
          5. Реализация
          <InfoTooltip
            className={styles.tooltip}
            iconClassName={styles.tooltipIcon}
            title="Заголовок тултипа"
            body={
              [
                {
                  text: [
                    'Бла бла',
                  ]
                },
              ]
            }
            size={'small'}
            pointer={'topLeft'}
            importantText={'Важно тут!'}
            link={'sdfsdsdsds'}
            type={'bulb'}
          />
        </h4>
        <form.Field name="prdMeta.problemStatement">
          {(field) => (
            <BigTextFieldForm
              title={"5.1 Постановка задачи"}
              placeholder="Дополнительные вводные данные"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              maxLength={PROJECT_LIMITS.prd.problemStatement.max}
              validError={getErrorMessage(field.state.meta.errors[0]) || stepErrors['prdMeta.problemStatement']?.[0]}
              isBlink={blinkFields.includes('Постановка задачи')}
            />
          )}
        </form.Field>
      </div>


    </div>
  );
}

function RealPrdFields({ form, stepErrors, blinkFields }: PrdFieldProps) {
  return (
    <div className={styles.mainFieldContainer}>
      <div className={styles.block} id="field-prd-real-prerequisites">
        <h4 className={styles.title}>
          1. Предпосылки
          <InfoTooltip
            className={styles.tooltip}
            iconClassName={styles.tooltipIcon}
            title="Заголовок тултипа"
            body={
              [
                {
                  text: [
                    'Бла бла',
                  ]
                },
              ]
            }
            size={'small'}
            pointer={'topLeft'}
            importantText={'Важно тут!'}
            link={'sdfsdsdsds'}
            type={'bulb'}
          />
        </h4>
        <form.Field name="prdMeta.prerequisites">
          {(field) => (
            <BigTextFieldForm
              placeholder="Текущая ситуация в бизнесе и основные проблемы"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              maxLength={PROJECT_LIMITS.prd.prerequisites.max}
              validError={getErrorMessage(field.state.meta.errors[0]) || stepErrors['prdMeta.prerequisites']?.[0]}
              isBlink={blinkFields.includes('Актуальность')}
            />
          )}
        </form.Field>
      </div>

      <div className={styles.block} id="field-prd-real-productVision">
        <h4 className={styles.title}>
          2. Product vision
          <InfoTooltip
            className={styles.tooltip}
            iconClassName={styles.tooltipIcon}
            title="Заголовок тултипа"
            body={
              [
                {
                  text: [
                    'Бла бла',
                  ]
                },
              ]
            }
            size={'small'}
            pointer={'topLeft'}
            importantText={'Важно тут!'}
            link={'sdfsdsdsds'}
            type={'bulb'}
          />
        </h4>
        <form.Field name="prdMeta.productVision">
          {(field) => (
            <BigTextFieldForm
              placeholder="Стратегическое описание продукта"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              maxLength={PROJECT_LIMITS.prd.productVision.max}
              validError={getErrorMessage(field.state.meta.errors[0]) || stepErrors['prdMeta.productVision']?.[0]}
              isBlink={blinkFields.includes('Product vision')}
            />
          )}
        </form.Field>
      </div>

      <div className={styles.blockBig}>
        <h4 className={styles.title}>
          3. Целевая аудитория
          <InfoTooltip
            className={styles.tooltip}
            iconClassName={styles.tooltipIcon}
            title="Заголовок тултипа"
            body={
              [
                {
                  text: [
                    'Бла бла',
                  ]
                },
              ]
            }
            size={'small'}
            pointer={'topLeft'}
            importantText={'Важно тут!'}
            link={'sdfsdsdsds'}
            type={'bulb'}
          />
        </h4>
        <TargetAudienceList form={form} stepErrors={stepErrors} blinkFields={blinkFields} />
      </div>

      <div className={styles.blockBig}>
        <h4 className={styles.title}>
          4. Цели
          <InfoTooltip
            className={styles.tooltip}
            iconClassName={styles.tooltipIcon}
            title="Заголовок тултипа"
            body={
              [
                {
                  text: [
                    'Бла бла',
                  ]
                },
              ]
            }
            size={'small'}
            pointer={'topLeft'}
            importantText={'Важно тут!'}
            link={'sdfsdsdsds'}
            type={'bulb'}
          />
        </h4>
        <div className={styles.block}>
          <form.Field name="prdMeta.projectGoal">
            {(field) => (
              <BigTextFieldForm
                title={"4.1 Цель проекта"}
                placeholder={"Главный результат проекта"}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                maxLength={PROJECT_LIMITS.prd.projectGoal.max}
                validError={getErrorMessage(field.state.meta.errors[0]) || stepErrors['prdMeta.projectGoal']?.[0]}
                isBlink={blinkFields.includes('Цель проекта')}
              />
            )}
          </form.Field>
          <form.Field name="prdMeta.businessGoal">
            {(field) => (
              <BigTextFieldForm
                title={"4.2 Цель бизнеса"}
                placeholder={"Коммерческая или стратегическая выгода "}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                maxLength={PROJECT_LIMITS.prd.businessGoal.max}
                validError={getErrorMessage(field.state.meta.errors[0]) || stepErrors['prdMeta.businessGoal']?.[0]}
                isBlink={blinkFields.includes('Бизнес цель')}
              />
            )}
          </form.Field>
        </div>
      </div>

      <div className={styles.blockBig}>
        <h4 className={styles.title}>
          5. Требования
          <InfoTooltip
            className={styles.tooltip}
            iconClassName={styles.tooltipIcon}
            title="Заголовок тултипа"
            body={
              [
                {
                  text: [
                    'Бла бла',
                  ]
                },
              ]
            }
            size={'small'}
            pointer={'topLeft'}
            importantText={'Важно тут!'}
            link={'sdfsdsdsds'}
            type={'bulb'}
          />
        </h4>
        <div className={styles.block}>
          <RequirementList
            form={form}
            stepErrors={stepErrors}
            name="prdMeta.keyFunctionality"
            title="5.1 Ключевой функционал"
            placeholder="Что да как кратенько..."
            minItems={2}
            maxLength={PROJECT_LIMITS.lists.itemLength.max}
            isBlink={blinkFields.includes('Ключевой функционал')}
          />
          <RequirementList
            form={form}
            stepErrors={stepErrors}
            name="prdMeta.functional"
            title="5.2 Функциональные требования"
            placeholder="Что да как кратенько..."
            minItems={2}
            maxLength={PROJECT_LIMITS.lists.itemLength.max}
            isBlink={blinkFields.includes('Функциональные требования')}
          />
          <RequirementList
            form={form}
            stepErrors={stepErrors}
            name="prdMeta.nonFunctional"
            title="5.3 Нефункциональные требования"
            placeholder="Что да как кратенько..."
            minItems={2}
            maxLength={PROJECT_LIMITS.lists.itemLength.max}
            isBlink={blinkFields.includes('Нефункциональные требования')}
          />
        </div>
      </div>

      <div className={styles.blockBig}>
        <h4 className={styles.title}>
          6. Реализация
          <InfoTooltip
            className={styles.tooltip}
            iconClassName={styles.tooltipIcon}
            title="Заголовок тултипа"
            body={
              [
                {
                  text: [
                    'Бла бла',
                  ]
                },
              ]
            }
            size={'small'}
            pointer={'topLeft'}
            importantText={'Важно тут!'}
            link={'sdfsdsdsds'}
            type={'bulb'}
          />
        </h4>
        <div className={styles.block}>
          <form.Field name="prdMeta.problemStatement">
            {(field) => (
              <BigTextFieldForm
                title={"6.1 Постановка задачи"}
                placeholder="Дополнительные вводные данные"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                maxLength={PROJECT_LIMITS.prd.problemStatement.max}
                validError={getErrorMessage(field.state.meta.errors[0]) || stepErrors['prdMeta.problemStatement']?.[0]}
                isBlink={blinkFields.includes('Постановка задачи')}
              />
            )}
          </form.Field>
          <RequirementList
            form={form}
            title={'6.2 Бизнес-метрики'}
            stepErrors={stepErrors}
            name="prdMeta.businessMetrics"
            placeholder="Что да как кратенько..."
            maxLength={PROJECT_LIMITS.lists.itemLength.max}
            isBlink={blinkFields.includes('Бизнес метрики')}
          />
        </div>
      </div>

      <div className={styles.block}>
        <h4 className={styles.title}>
          7. План проекта
          <InfoTooltip
            className={styles.tooltip}
            iconClassName={styles.tooltipIcon}
            title="Заголовок тултипа"
            body={
              [
                {
                  text: [
                    'Бла бла',
                  ]
                },
              ]
            }
            size={'small'}
            pointer={'topLeft'}
            importantText={'Важно тут!'}
            link={'sdfsdsdsds'}
            type={'bulb'}
          />
        </h4>
        <RequirementList
          form={form}
          stepErrors={stepErrors}
          name="prdMeta.projectPlan"
          placeholder="Что да как кратенько..."
          maxLength={PROJECT_LIMITS.projectPlan.itemLength.max}
          minItems={2}
          isBlink={blinkFields.includes('План проекта')}
        />
      </div>
    </div>
  );
}

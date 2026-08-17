import clsx from 'clsx'
import { useStore } from '@tanstack/react-form'
import styles from './ProjectInfoStep.module.css'
import { MainInfoTab } from './tabs/MainInfoTab'
import { PrdTab } from './tabs/PrdTab'
import { RolesTab } from './tabs/RolesTab'
import { DatesTab } from './tabs/DatesTab'
import { AllTab } from './tabs/AllTab'
import type { CreateProjectForm, StepErrors } from '@/features/create-project'
import { BackArrowIcon, HorizontalTabs, type HorizontalTabItem } from '@/shared'

type InfoTab = 'main' | 'prd' | 'roles' | 'dates' | 'all'

interface ProjectInfoStepProps {
  form: CreateProjectForm
  stepErrors: StepErrors
  isPending: boolean
  onSubmit: () => void
  onDeleteDraft: () => void
  /** { value: ID, verbose: отображаемое название } */
  partners: { value: string; verbose: string }[]
  currentStep: number
  nextStep: () => void
  prevStep: () => void
  setStep: (step: number) => void
}

export function ProjectInfoStep({
  form,
  stepErrors,
  isPending,
  onSubmit,
  onDeleteDraft,
  partners,
  currentStep,
  nextStep,
  prevStep,
  setStep
}: ProjectInfoStepProps) {
  const fieldMeta = useStore(form.store, state => state.fieldMeta)

  const hasTabErrors = (tabKey: InfoTab): boolean => {
    // Собираем все ошибки: из stepErrors (пришедшие из локальной валидации)
    // и из текущих нативных ошибок полей TanStack Form
    const allErrors: Record<string, unknown[]> = { ...stepErrors }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.keys(fieldMeta).forEach(key => {
      const meta = fieldMeta[key as keyof typeof fieldMeta]
      if (meta?.errors?.length) {
        allErrors[key] = meta.errors as unknown[]
      }
    })

    const errorKeys = Object.keys(allErrors).filter(key => allErrors[key]?.length > 0)

    if (tabKey === 'main') {
      return errorKeys.some(k => k.startsWith('meta.') || k === 'primaryTag' || k === 'tags' || k === 'partnerId')
    }
    if (tabKey === 'prd') {
      return errorKeys.some(k => k.startsWith('prdMeta'))
    }
    if (tabKey === 'roles') {
      return errorKeys.some(k => k.startsWith('roles'))
    }
    if (tabKey === 'dates') {
      return errorKeys.some(k => k.startsWith('checkpoints') || k.startsWith('links'))
    }
    return false
  }

  const tabItems: HorizontalTabItem<InfoTab>[] = [
    { value: 'main', label: 'Основная информация', error: hasTabErrors('main') },
    { value: 'prd', label: 'Требования к продукту', error: hasTabErrors('prd') },
    { value: 'roles', label: 'Команда и компетенции', error: hasTabErrors('roles') },
    { value: 'dates', label: 'Дата и ресурсы', error: hasTabErrors('dates') },
    { value: 'all', label: 'Проверка информации', error: hasTabErrors('all') }
  ]

  const activeTab: InfoTab = tabItems[currentStep - 1]?.value || 'main'
  const isFirstStep = currentStep === 1
  const isLastStep = currentStep === tabItems.length

  return (
    <main className={clsx(styles.root)}>
      <HorizontalTabs
        className={styles.nav}
        items={tabItems}
        value={activeTab}
        onChange={() => setStep(tabItems.findIndex(t => t.value === t.value) + 1)}
      />

      <div className={styles.main}>
        <div>
          {activeTab === 'main' && <MainInfoTab form={form} stepErrors={stepErrors} partners={partners} />}
          {activeTab === 'prd' && <PrdTab form={form} stepErrors={stepErrors} />}
          {activeTab === 'roles' && <RolesTab form={form} stepErrors={stepErrors} />}
          {activeTab === 'dates' && <DatesTab form={form} stepErrors={stepErrors} />}
          {activeTab === 'all' && <AllTab form={form} />}
        </div>
      </div>

      <div className={styles.buttonBlock}>
        <div>
          {!isFirstStep && (
            <button type='button' onClick={prevStep} className={styles.prevButton}>
              <BackArrowIcon />К предыдущему шагу
            </button>
          )}
        </div>

        <div className={styles.rightButtons}>
          <button type='button' onClick={onDeleteDraft} className={styles.cancelButton}>
            Сохранить черновик
          </button>

          {!isLastStep ? (
            <button type='button' onClick={nextStep} className={styles.nextButton}>
              К следующему шагу
            </button>
          ) : (
            <button
              type='button'
              onClick={onSubmit}
              disabled={isPending}
              className={clsx(styles.saveButton, isPending ? styles.disable : '')}
            >
              {isPending ? 'Отправка...' : 'Опубликовать проект'}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}

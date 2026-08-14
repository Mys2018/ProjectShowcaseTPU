import type { CreateProjectForm, StepErrors } from '@/features/create-project/model/useProjectWizard';
import BackIcon from '@/shared/ui/icons/back.svg?react';

import styles from './ProjectInfoStep.module.css'
import clsx from "clsx";
import { MainInfoTab } from './tabs/MainInfoTab';
import { PrdTab } from './tabs/PrdTab';
import { RolesTab } from './tabs/RolesTab';
import { DatesTab } from './tabs/DatesTab';
import { AllTab } from './tabs/AllTab';
import { useStore } from '@tanstack/react-form';

type InfoTab = 'main' | 'prd' | 'roles' | 'dates' | 'all';

const TABS: { key: InfoTab; label: string }[] = [
  { key: 'main', label: 'Основная информация' },
  { key: 'prd', label: 'Требования к продукту' },
  { key: 'roles', label: 'Команда и компетенции' },
  { key: 'dates', label: 'Дата и ресурсы' },
  { key: 'all', label: 'Проверка информации' },
];

interface ProjectInfoStepProps {
  form: CreateProjectForm;
  stepErrors: StepErrors;
  isPending: boolean;
  onSubmit: () => void;
  onDeleteDraft: () => void;
  partners: { value: string; verbose: string }[];
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
}

export function ProjectInfoStep({ form, stepErrors, isPending, onSubmit, onDeleteDraft, partners, currentStep, nextStep, prevStep, setStep }: ProjectInfoStepProps) {
  const fieldMeta = useStore(form.store, (state) => state.fieldMeta);

  const activeTab = TABS[currentStep - 1]?.key || 'main';
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === TABS.length;

  const hasTabErrors = (tabKey: InfoTab): boolean => {
    // Собираем все ошибки: из stepErrors (пришедшие из локальной валидации)
    // и из текущих нативных ошибок полей TanStack Form
    const allErrors: Record<string, unknown[]> = { ...stepErrors };

    Object.keys(fieldMeta).forEach((key) => {
      const meta = fieldMeta[key as keyof typeof fieldMeta];
      if (meta?.errors?.length) {
        allErrors[key] = meta.errors as unknown[];
      }
    });

    const errorKeys = Object.keys(allErrors).filter((key) => allErrors[key]?.length > 0);

    if (tabKey === 'main') {
      return errorKeys.some((k) =>
        k.startsWith('meta.') ||
        k === 'primaryTag' ||
        k === 'tags' ||
        k === 'partnerId'
      );
    }
    if (tabKey === 'prd') {
      return errorKeys.some((k) => k.startsWith('prdMeta'));
    }
    if (tabKey === 'roles') {
      return errorKeys.some((k) => k.startsWith('roles'));
    }
    if (tabKey === 'dates') {
      return errorKeys.some((k) => k.startsWith('checkpoints') || k.startsWith('links'));
    }
    return false;
  };

  return (
    <main className={clsx(styles.root)}>
      <nav className={styles.nav}>
        <div className={styles.leftBlock}>
          {TABS.map((tab, index)  => {
            if (index === 4) return null;
            const hasError = hasTabErrors(tab.key);
            return (
              <button
                className={clsx(
                  styles.navItem,
                  activeTab === tab.key && styles.active,
                  hasError && styles.navItemError
                )}
                key={tab.key}
                type="button"
                onClick={() => setStep(TABS.findIndex((t) => t.key === tab.key) + 1)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <button
          className={clsx(
            styles.navItem,
            activeTab === TABS[4].key && styles.active,
            hasTabErrors(TABS[4].key) && styles.navItemError
          )}
          key={TABS[4].key}
          type="button"
          onClick={() => setStep(TABS.findIndex((t) => t.key === TABS[4].key) + 1)}
        >
          {TABS[4].label}
        </button>
      </nav>


      <div className={styles.main}>
        <div>
          {activeTab === 'main' && <MainInfoTab form={form} stepErrors={stepErrors} partners={partners} />}
          {activeTab === 'prd' && <PrdTab form={form} stepErrors={stepErrors} />}
          {activeTab === 'roles' && <RolesTab form={form} stepErrors={stepErrors} />}
          {activeTab === 'dates' && <DatesTab form={form} stepErrors={stepErrors} />}
          {activeTab === 'all' && <AllTab form={form}/>}
        </div>
      </div>

      <div className={styles.buttonBlock}>
        <div>
          {!isFirstStep && (
            <button type="button" onClick={prevStep} className={styles.prevButton}>
              <BackIcon/>
              К предыдущему шагу
            </button>
          )}
        </div>

        <div className={styles.rightButtons}>
          <button
            type="button"
            onClick={onDeleteDraft}
            className={styles.cancelButton}
          >
            Сохранить черновик
          </button>

          {!isLastStep ? (
            <button type="button" onClick={nextStep} className={styles.nextButton}>
              К следующему шагу
            </button>
          ) : (
            <button
              type="button"
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
  );
}


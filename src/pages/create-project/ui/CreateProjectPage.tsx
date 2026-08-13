import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './CreateProjectPage.module.css';
import BackIcon from '@/shared/ui/icons/back.svg?react';
import { CreateProjectCard } from '@/shared/ui/create-project-card/CreateProjectCard.tsx';
import { ProjectInfoStep } from '@/features/create-project/ui/ProjectInfoStep';
import {
  useProjectWizard,
  type CreateProjectFormValues,
} from '@/features/create-project/model/useProjectWizard';
import { useCreateProject } from '@/entities/project/api/queries';
import type { CreateProjectRequestType } from '@/entities/project/model/types';

import { usePartners } from '@/entities/partner/api/queries';
import {CreateProjectProgressWidget} from "@/shared/ui/create-project-progress-widget/CreateProjectProgressWidget.tsx";
import {getSaveStatus} from "@/shared/constants/save-status-drafts/getSaveStatus.tsx";
import { useProjectDraft, useSaveDraft, useDeleteDraft } from '@/entities/project/api/queries';
import type { StatusType } from '@/shared/constants/save-status-drafts/getSaveStatus.tsx';

type PageStep = 'type-select' | 'fill';

const AUTOSAVE_DELAY_MS = 3000;

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isDraftMode = searchParams.get('draft') === 'true';

  const [pageStep, setPageStep] = useState<PageStep>(isDraftMode ? 'fill' : 'type-select');
  const [selectedType, setSelectedType] = useState<CreateProjectRequestType>('Study');
  const [saveStatus, setSaveStatus] = useState<StatusType | 'idle'>('idle');

  const { data: draftData, isLoading: isDraftLoading } = useProjectDraft();
  const { mutate: saveDraft } = useSaveDraft();
  const { mutate: deleteDraftMutation } = useDeleteDraft();

  const { data: partnersList = [] } = usePartners();
  const mappedPartners = partnersList.map(p => ({ value: p.id, verbose: p.name }));

  const { mutate: createProject, isPending } = useCreateProject();

  // Determine default values from draft if available
  const draftDefaultValues = isDraftMode && draftData?.data
    ? (draftData.data as Partial<CreateProjectFormValues>)
    : undefined;

  const initialType = draftDefaultValues?.type || selectedType;

  const { form, stepErrors, currentStep, nextStep, prevStep, setStep } = useProjectWizard({
    defaultValues: {
      type: initialType,
      ...draftDefaultValues,
    } as Partial<CreateProjectFormValues>,
    onSubmit: (values) => {
      createProject(values, {
        onSuccess: () => {
          // Delete draft after successful publish
          deleteDraftMutation();
          navigate(-1);
        },
      });
    },
  });

  // Set selectedType from draft on load
  useEffect(() => {
    if (draftDefaultValues?.type) {
      setSelectedType(draftDefaultValues.type);
    }
  }, [draftDefaultValues?.type]);

  // --- Auto-save logic ---
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousValuesRef = useRef<string>('');

  const performAutoSave = useCallback(() => {
    const currentValues = form.state.values;
    const serialized = JSON.stringify(currentValues);

    // Skip save if nothing changed
    if (serialized === previousValuesRef.current) return;
    previousValuesRef.current = serialized;

    setSaveStatus('save');

    saveDraft(currentValues as unknown as Record<string, unknown>, {
      onSuccess: () => {
        setSaveStatus('saving');
        // Reset to idle after 2 seconds
        setTimeout(() => setSaveStatus('idle'), 2000);
      },
      onError: (error) => {
        // Check if it's a network error
        if (error && 'code' in error && (error as { code?: string }).code === 'ERR_NETWORK') {
          setSaveStatus('errorNetwork');
        } else {
          setSaveStatus('failed');
          // Retry after 5 seconds
          setTimeout(() => performAutoSave(), 5000);
        }
      },
    });
  }, [form.state.values, saveDraft]);

  // Subscribe to form changes for auto-save (only in fill mode)
  useEffect(() => {
    if (pageStep !== 'fill') return;

    const subscription = form.store.subscribe(() => {
      // Clear previous timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      // Set new debounce timer
      autoSaveTimerRef.current = setTimeout(() => {
        performAutoSave();
      }, AUTOSAVE_DELAY_MS);
    });

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      if (typeof subscription === 'function') {
        (subscription as () => void)();
      } else if (subscription && typeof (subscription as { unsubscribe?: () => void }).unsubscribe === 'function') {
        (subscription as { unsubscribe: () => void }).unsubscribe();
      }
    };
  }, [pageStep, form.store, performAutoSave]);

  // Выбор типа и переход к форме
  const handleTypeSelect = (type: CreateProjectRequestType) => {
    setSelectedType(type);
    form.setFieldValue('type', type);
    // Сбрасываем prdMeta под новый тип
    if (type === 'Study') {
      form.setFieldValue('prdMeta', { prerequisites: '', projectGoal: '', keyFunctionality: ['', '', ''] });
    } else if (type === 'Case') {
      form.setFieldValue('prdMeta', { prerequisites: '', projectGoal: '', audience: [{title: '', description: '', minAge: 18, maxAge: 35}], functional: ['', '', ''], problemStatement: '' });
    } else {
      form.setFieldValue('prdMeta', { productVision: '', projectGoal: '', businessGoal: '', audience: [{title: '', description: '', minAge: 18, maxAge: 35}], functional: ['', '', ''], nonFunctional: ['', '', ''], businessMetrics: [''], projectPlan: [''] });
    }
    setPageStep('fill');
  };

  const handleDeleteDraft = () => {
    // Save current state as draft and navigate back
    const currentValues = form.state.values;
    saveDraft(currentValues as unknown as Record<string, unknown>, {
      onSuccess: () => navigate(-1),
    });
  };

  const handleSubmit = () => {
    form.handleSubmit();
  };

  if (isDraftMode && isDraftLoading) {
    return (
      <main className={styles.mainContent}>
        <p>Загрузка черновика...</p>
      </main>
    );
  }

  if (pageStep === 'type-select') {
    return (
      <main className={styles.mainContent}>
        <div className={styles.headerLeft} onClick={() => navigate(-1)}>
          <BackIcon />
          <p>Назад к списку проектов</p>
        </div>

        <h1 className={styles.title}>Новый проект</h1>

        <section className={styles.body}>
          <div className={styles.description}>
            <p>Выберите тип проекта</p>
            <p>
              От выбранного типа зависит состав полей и PRD. В дальнейшем тип проекта можно будет
              изменить при необходимости
            </p>
          </div>

          <div className={styles.projectList}>
            <CreateProjectCard type="Study" onClick={() => handleTypeSelect('Study')} />
            <CreateProjectCard type="Case" onClick={() => handleTypeSelect('Case')} />
            <CreateProjectCard type="Real" onClick={() => handleTypeSelect('Real')} />
          </div>
        </section>
      </main>
    );
  }
  const typeLabel = selectedType === 'Study' ? 'Учебный' : selectedType === 'Case' ? 'Кейс' : 'Реальный';

  return (
    <div className={styles.formPageWrapper}>
      <main className={styles.mainContent}>
        <div
          className={styles.headerLeft}
          onClick={() => setPageStep('type-select')}
          style={{ cursor: 'pointer' }}
        >
          <BackIcon />
          <p>Назад к выбору типа проекта</p>
        </div>

        <h1 className={styles.title}>Новый проект — «{typeLabel}»</h1>

        <section className={styles.saveStatusContainer}>
          {saveStatus !== 'idle' && getSaveStatus(saveStatus)}
        </section>

        <section className={styles.progressBlock}>
          <CreateProjectProgressWidget
            form={form}
            onStepClick={(index) => {
              if (index === 0) {
                setPageStep('type-select');
              } else {
                setStep(index);
              }
            }}
          />
        </section>

        <section className={styles.body}>
          <ProjectInfoStep
            form={form}
            stepErrors={stepErrors}
            isPending={isPending}
            onSubmit={handleSubmit}
            onDeleteDraft={handleDeleteDraft}
            partners={mappedPartners}
            currentStep={currentStep}
            nextStep={nextStep}
            prevStep={prevStep}
            setStep={setStep}
          />
        </section>
      </main>
    </div>
  );
}
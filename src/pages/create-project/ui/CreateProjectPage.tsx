import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMediaQuery } from 'usehooks-ts';
import styles from './CreateProjectPage.module.css';
import BackIcon from '@/shared/ui/icons/back.svg?react';
import { CreateProjectCard } from '@/shared/ui/create-project-card/CreateProjectCard.tsx';
import { ProjectInfoStep } from '@/features/create-project/ui/ProjectInfoStep';
import {
  useProjectWizard,
  calculateProjectWizardProgress,
  type CreateProjectFormValues,
  type WizardProgress,
} from '@/features/create-project';
import { useCreateProject, useProjectDetails, useSetProjectStatus } from '@/entities/project/api/queries';
import { mapProjectToDraftValues } from '@/entities/draft';
import type { CreateProjectRequestType, PrdMeta } from '@/entities/project/model/types';
import {
  getProjectFormatTranslation,
  useProjectReview,
  useUpdateProject,
} from '@/entities/project';

import { usePartners } from '@/entities/partner/api/queries';
import { CreateProjectProgressWidget } from "@/shared/ui/create-project-progress-widget/CreateProjectProgressWidget.tsx";
import { getSaveStatus } from "@/shared/constants/save-status-drafts/getSaveStatus.tsx";
import { useProjectDraft, useSaveDraft, useDeleteDraft } from '@/entities/project/api/queries';
import type { StatusType } from '@/shared/constants/save-status-drafts/getSaveStatus.tsx';
import { BackLink } from '@/shared/ui/back-link';
import { DesktopOnlyStub } from '@/shared/ui';
import { MOBILE_BREAKPOINT } from '@/shared/lib';
import { ROUTES } from '@/shared';
import {useMe} from "@/entities/user";

type PageStep = 'type-select' | 'fill';

const AUTOSAVE_DELAY_MS = 3000;

interface CreateProjectWizardFormProps {
  isDraftMode: boolean;
  initialDraft: (Partial<CreateProjectFormValues> & {
    currentStep?: number;
    highestStep?: number;
    progress?: WizardProgress;
  }) | null;
  restoreValues?: (Partial<CreateProjectFormValues> & {
    currentStep?: number;
    highestStep?: number;
    progress?: WizardProgress;
  }) | null;
  isDraftLoading?: boolean;
  editProjectId?: string | null;
  editOwnerId?: number | null;
  editOriginalRoles?: { roleId: string; roleTypeId?: string }[];
}

function CreateProjectWizardForm({ isDraftMode, initialDraft, restoreValues, isDraftLoading, editProjectId, editOwnerId, editOriginalRoles }: CreateProjectWizardFormProps) {
  const navigate = useNavigate();
  const initialType = (initialDraft?.type as CreateProjectRequestType) || 'Study';

  const [pageStep, setPageStep] = useState<PageStep>(isDraftMode ? 'fill' : 'type-select');
  const [selectedType, setSelectedType] = useState<CreateProjectRequestType>(initialType);
  const [saveStatus, setSaveStatus] = useState<StatusType | 'idle'>('idle');

  const { mutate: saveDraft } = useSaveDraft();
  const { mutate: deleteDraftMutation } = useDeleteDraft();

  const { data: partnersList = [] } = usePartners();
  const mappedPartners = partnersList.map(p => ({ value: p.id, verbose: p.name }));

  const { mutate: createProject, isPending: isCreatePending } = useCreateProject();
  const { mutate: updateProject, isPending: isUpdatePending } = useUpdateProject();
  const { mutate: setProjectStatus, isPending: isStatusPending } = useSetProjectStatus();
  const isPending = isCreatePending || isUpdatePending || isStatusPending;
  const { data: review, isLoading: isReviewLoading } = useProjectReview(editProjectId ?? '', Boolean(editProjectId));

  // --- Auto-save logic ---
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousValuesRef = useRef<string>('');
  const saveStatusRef = useRef<StatusType | 'idle'>('idle');
  // После publish/delete autosave больше нельзя: cleanup подписки иначе
  // флашит последний payload и воскрешает только что удалённый черновик.
  const draftDiscardedRef = useRef(false);

  const discardDraftAndLeave = useCallback(() => {
    draftDiscardedRef.current = true;
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
    deleteDraftMutation(undefined, {
      onSettled: () => {
        navigate(-1);
      },
    });
  }, [deleteDraftMutation, navigate]);

  const { form, stepErrors, currentStep, highestStep, nextStep, prevStep, setStep, blinkFields, setBlinkFields } = useProjectWizard({
    defaultValues: initialDraft ?? {
      type: selectedType,
    } as Partial<CreateProjectFormValues>,
    restoreValues,
    isDraftLoading,
    onSubmit: (values) => {
      if (editProjectId) {
        const { meta, ...rest } = values;
        // RoleUpdateDto: id существующей роли обязателен, иначе бэкенд пытается
        // создать новую с тем же roleTypeId → уникальный ключ (project, roleType)
        // нарушается → CONFLICT. Привязываем форму к существующим ролям проекта.
        const originalRoles = editOriginalRoles ?? [];
        const updateRoles = values.roles.map((role) => {
          const originalRole = originalRoles.find((r) => r.roleTypeId === role.roleTypeId);
          return originalRole ? { ...role, roleId: originalRole.roleId } : role;
        });
        updateProject({
          projectId: editProjectId,
          payload: {
            ...rest,
            roles: updateRoles,
            ownerId: editOwnerId ?? values.ownerId,
            title: meta?.title ?? '',
            description: meta?.description ?? '',
          },
        }, {
          onSuccess: () => {
            // Доработка отправлена — возвращаем проект на модерацию.
            // Только после смены статуса уходим назад, иначе проект
            // останется в NeedsRework и «потеряется».
            setProjectStatus({ projectId: editProjectId, status: 'Pending' }, {
              onSuccess: discardDraftAndLeave,
            });
          },
        });
      } else {
        createProject(values, { onSuccess: discardDraftAndLeave });
      }
    },
  });

  // Initialize previousValuesRef on mount with initial draft payload
  useEffect(() => {
    const currentValues = form.state.values;
    const progress = calculateProjectWizardProgress(currentValues);
    const initialPayload = { ...currentValues, currentStep, highestStep, progress };
    previousValuesRef.current = JSON.stringify(initialPayload);
  }, []);

  useEffect(() => {
    saveStatusRef.current = saveStatus;
  }, [saveStatus]);

  const latestDataRef = useRef({ form, currentStep, highestStep });
  useEffect(() => {
    latestDataRef.current = { form, currentStep, highestStep };
  }, [form, currentStep, highestStep]);

  const performAutoSave = useCallback(() => {
    if (draftDiscardedRef.current) return;

    const { form: curForm, currentStep: curStep, highestStep: curHighest } = latestDataRef.current;

    const currentValues = curForm.state.values;
    const progress = calculateProjectWizardProgress(currentValues);
    const draftPayload = { ...currentValues, currentStep: curStep, highestStep: curHighest, progress };
    const serialized = JSON.stringify(draftPayload);

    // Skip save if nothing changed
    if (serialized === previousValuesRef.current) return;

    setSaveStatus('save');

    saveDraft(draftPayload, {
      onSuccess: () => {
        if (draftDiscardedRef.current) return;
        previousValuesRef.current = serialized;
        setSaveStatus('saving');
        // Reset to idle after 2 seconds
        setTimeout(() => setSaveStatus('idle'), 2000);
      },
      onError: (error) => {
        if (draftDiscardedRef.current) return;
        // Прошлый payload не считаем сохранённым — иначе retry ниже
        // увидит «ничего не изменилось» и не отправит ничего.
        previousValuesRef.current = '';
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
  }, [saveDraft]);

  // Subscribe to form changes for auto-save (only in fill mode)
  useEffect(() => {
    if (pageStep !== 'fill') return;

    const subscription = form.store.subscribe(() => {
      if (draftDiscardedRef.current) return;
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
        autoSaveTimerRef.current = null;
        // Незавершённый debounce не выбрасываем: флашим последнее изменение.
        // После publish/delete флашить нельзя — иначе черновик воскреснет.
        if (!draftDiscardedRef.current) {
          performAutoSave();
        }
      }
      if (typeof subscription === 'function') {
        (subscription as () => void)();
      } else if (subscription && typeof (subscription as { unsubscribe?: () => void }).unsubscribe === 'function') {
        (subscription as { unsubscribe: () => void }).unsubscribe();
      }
    };
  }, [pageStep, form.store, performAutoSave]);

  // Save on step change
  useEffect(() => {
    if (pageStep !== 'fill' || draftDiscardedRef.current) return;

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      performAutoSave();
    }, AUTOSAVE_DELAY_MS);
  }, [currentStep, highestStep, pageStep, performAutoSave]);

  // F5/закрытие вкладки: если автосейв падал, последние правки существуют
  // только в памяти — просим браузер показать диалог «есть несохранённые изменения»
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (saveStatusRef.current === 'failed' || saveStatusRef.current === 'errorNetwork') {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pageStep, currentStep]);

  // Выбор типа и переход к форме
  const handleTypeSelect = (type: CreateProjectRequestType) => {
    setSelectedType(type);
    form.setFieldValue('type', type);

    // Мерджим, а не заменяем: переход Study → Case → Study не должен стирать
    // поля, специфичные для типа (productVision, businessMetrics и т.д.).
    // Zod-union всё равно читает только поля своего типа.
    const currentPrdMeta = (form.state.values.prdMeta as Partial<PrdMeta>) || {};
    const basePrdMeta = {
      prerequisites: currentPrdMeta.prerequisites ?? '',
      projectGoal: currentPrdMeta.projectGoal ?? '',
      keyFunctionality: currentPrdMeta.keyFunctionality ?? ['', ''],
      audience: currentPrdMeta.audience ?? [{ title: '', description: '', minAge: 18, maxAge: 35 }],
      functional: currentPrdMeta.functional ?? ['', ''],
      problemStatement: currentPrdMeta.problemStatement ?? '',
      productVision: currentPrdMeta.productVision ?? '',
      businessGoal: currentPrdMeta.businessGoal ?? '',
      nonFunctional: currentPrdMeta.nonFunctional ?? ['', ''],
      businessMetrics: currentPrdMeta.businessMetrics ?? ['', ''],
      projectPlan: currentPrdMeta.projectPlan ?? ['', ''],
    };

    if (type === 'Study') {
      form.setFieldValue('prdMeta', {
        prerequisites: basePrdMeta.prerequisites,
        projectGoal: basePrdMeta.projectGoal,
        keyFunctionality: basePrdMeta.keyFunctionality,
      });
    } else if (type === 'Case') {
      form.setFieldValue('prdMeta', {
        prerequisites: basePrdMeta.prerequisites,
        projectGoal: basePrdMeta.projectGoal,
        audience: basePrdMeta.audience,
        functional: basePrdMeta.functional,
        problemStatement: basePrdMeta.problemStatement,
      });
    } else {
      form.setFieldValue('prdMeta', basePrdMeta);
    }
    setStep(1);
    setPageStep('fill');
  };

  const handleDeleteDraft = () => {
    // Save current state as draft and navigate back
    const currentValues = form.state.values;
    const progress = calculateProjectWizardProgress(currentValues);
    const draftPayload = { ...currentValues, currentStep, highestStep, progress };
    saveDraft(draftPayload, {
      onSuccess: () => navigate(-1),
    });
  };

  const handleSubmit = () => {
    form.handleSubmit();
  };

  if (pageStep === 'type-select') {
    return (
      <main className={styles.mainContent}>
        <BackLink fallback={ROUTES.MAIN} className={styles.headerLeft} />

        <h1 className={styles.title}>{editProjectId ? 'Редактирование проекта' : 'Новый проект'}</h1>

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

  const typeLabel = getProjectFormatTranslation(selectedType);

  return (
    <div className={styles.formPageWrapper}>
      <main className={styles.mainContent}>
        <div
          className={styles.headerLeft}
          onClick={() => {
            if (editProjectId) {
              navigate(-1);
            } else {
              setPageStep('type-select');
            }
          }}
        >
          <BackIcon />
          {/* Шаг мастера, а не страница, поэтому мимо словаря — но подпись
              по тому же правилу: стрелка плюс название, куда ведёт. */}
          <p>{editProjectId ? 'Моя платформа' : 'Выбор типа проекта'}</p>
        </div>

        <h1 className={styles.title}>{editProjectId ? 'Редактирование проекта' : 'Новый проект'} — «{typeLabel}»</h1>

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
            onEditType={() => setPageStep('type-select')}
            stepErrors={stepErrors}
            isPending={isPending}
            onSubmit={handleSubmit}
            onDeleteDraft={handleDeleteDraft}
            isEditMode={Boolean(editProjectId)}
            review={review}
            isReviewLoading={isReviewLoading}
            partners={mappedPartners}
            currentStep={currentStep}
            nextStep={nextStep}
            prevStep={prevStep}
            setStep={setStep}
            blinkFields={blinkFields}
            setBlinkFields={setBlinkFields}
          />
        </section>
      </main>
    </div>
  );
}

export function CreateProjectPage() {
  const { data: me, isLoading: isMeLoading } = useMe();
  const [searchParams] = useSearchParams();
  const isDraftMode = searchParams.get('draft') === 'true';
  const editProjectId = searchParams.get('projectId');
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

  const { data: draftData, isLoading: isDraftLoading } = useProjectDraft();
  const { data: projectData, isLoading: isProjectLoading } = useProjectDetails(editProjectId ?? '');

  if (isMeLoading) {
    return (
      <main className={styles.mainContent}>
        <p>Загрузка...</p>
      </main>
    );
  }

  const isCurator = me?.roles?.some((role) => role.type === 'Curator');

  if (!isCurator) {
    return null;
  }

  // Мобильным страница не показывается: конструктор слишком тяжёл для узкого
  // экрана. Заглушка по макету — после всех хуков, чтобы не ломать rules of hooks.
  if (isMobile) {
    return <DesktopOnlyStub />;
  }

  if (editProjectId && isProjectLoading) {
    return (
      <main className={styles.mainContent}>
        <p>Загрузка проекта...</p>
      </main>
    );
  }

  if (editProjectId && !projectData) {
    return (
      <main className={styles.mainContent}>
        <p>Проект не найден</p>
      </main>
    );
  }

  if (isDraftMode && !editProjectId && isDraftLoading) {
    return (
      <main className={styles.mainContent}>
        <p>Загрузка черновика...</p>
      </main>
    );
  }

  const draftPayload = isDraftMode && !editProjectId && draftData?.data
    ? (draftData.data as Partial<CreateProjectFormValues> & {
        currentStep?: number;
        highestStep?: number;
        progress?: WizardProgress;
      })
    : null;

  const restoreValues = editProjectId && projectData ? mapProjectToDraftValues(projectData) : null;

  return (
    <CreateProjectWizardForm
      key={editProjectId ?? (isDraftMode ? 'draft' : 'new')}
      isDraftMode={Boolean(editProjectId) || isDraftMode}
      initialDraft={draftPayload}
      restoreValues={restoreValues}
      isDraftLoading={editProjectId ? isProjectLoading : isDraftLoading}
      editProjectId={editProjectId}
      editOwnerId={projectData?.ownerId ?? null}
      editOriginalRoles={projectData?.roles ?? []}
    />
  );
}
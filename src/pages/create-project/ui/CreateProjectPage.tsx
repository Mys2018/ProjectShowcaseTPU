import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

type PageStep = 'type-select' | 'fill';

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const [pageStep, setPageStep] = useState<PageStep>('type-select');
  const [selectedType, setSelectedType] = useState<CreateProjectRequestType>('Study');

  const { data: partnersList = [] } = usePartners();
  const mappedPartners = partnersList.map(p => ({ value: p.id, verbose: p.name }));

  const { mutate: createProject, isPending } = useCreateProject();

  const { form, stepErrors, currentStep, nextStep, prevStep, setStep } = useProjectWizard({
    defaultValues: { type: selectedType } as Partial<CreateProjectFormValues>,
    onSubmit: (values) => {
      createProject(values, {
        onSuccess: () => {
          // alert('Проект успешно создан!');
          navigate(-1);
        },
      });
    },
  });

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
    if (confirm('Удалить черновик? Все введённые данные будут потеряны.')) {
      navigate(-1);
    }
  };

  const handleSubmit = () => {
    form.handleSubmit();
  };

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


        <section className={styles.progressBlock}>
          <CreateProjectProgressWidget
            form={form}
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
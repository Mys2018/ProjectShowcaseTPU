import styles from './CreateProjectProgressWidget.module.css'
import type {CreateProjectForm} from "@/features/create-project/model/useProjectWizard.ts";
import CheckIcon from '@/shared/ui/icons/check.svg?react'
import clsx from "clsx";
import {useStore} from "@tanstack/react-form";
import {calculateProgress} from "@/shared/utils/progress/calculateProgress.ts";

interface CreateProjectProgressWidgetProps {
  form: CreateProjectForm;
  onStepClick?: (index: number) => void;
}

export const CreateProjectProgressWidget = ({form, onStepClick}: CreateProjectProgressWidgetProps) => {
  const formValues = useStore(form.store, (state) => state.values)

  const step1Progress = calculateProgress([
    formValues.type
  ])

  const step2Progress = calculateProgress([
    formValues.meta?.title,
    formValues.meta?.description,
    formValues.primaryTag,
    formValues.tags,
    formValues.partnerId
  ])

  const step3Progress = calculateProgress([
    ...(formValues.type === 'Study' ? [
      formValues.prdMeta.prerequisites,
      formValues.prdMeta.projectGoal,
      formValues.prdMeta.keyFunctionality
    ] : []),

    ...(formValues.type === 'Case' ? [
      formValues.prdMeta.prerequisites,
      formValues.prdMeta.audience,
      formValues.prdMeta.functional,
      formValues.prdMeta.problemStatement
    ] : []),

    ...(formValues.type === 'Real' ? [

      formValues.prdMeta.productVision,
      formValues.prdMeta.audience,
      formValues.prdMeta.projectGoal,
      formValues.prdMeta.businessGoal,
      formValues.prdMeta.functional,
      formValues.prdMeta.nonFunctional,
      formValues.prdMeta.businessMetrics,
      formValues.prdMeta.projectPlan
    ] : [])
  ])

  const step4Progress = calculateProgress([
    formValues.roles,
  ])

  const step5Progress = calculateProgress([
    formValues.links
  ])

  const progresses = [step1Progress, step2Progress, step3Progress, step4Progress, step5Progress];
  const currentStepIndex = progresses.findIndex(p => p < 100);
  const isDataFillActive = currentStepIndex >= 2 || currentStepIndex === -1;

  const getSubtitleClass = (index: number) => {
    if (progresses[index] === 100) return styles.subtitlePassed;
    if (index === currentStepIndex) return styles.subtitleCurrent;
    return styles.subtitleInactive;
  };

  return (
    <aside className={styles.progressBlock}>

      <div className={styles.block}>
        <p className={styles.title}>
          Создание проекта
        </p>
        <div className={styles.progressRow} onClick={() => onStepClick?.(0)}>
          <ProgressBlock
            progress={step1Progress}
            step={1}
          />
          <p className={clsx(styles.subtitle, getSubtitleClass(0))}>
            Выбор типа
          </p>
        </div>

        <div className={styles.progressRow} onClick={() => onStepClick?.(1)}>
          <ProgressBlock
            progress={step2Progress}
            step={2}
          />
          <p className={clsx(styles.subtitle, getSubtitleClass(1))}>
            Основная информация
          </p>
        </div>
      </div>

      <div className={styles.block}>
        <p className={clsx(styles.title, !isDataFillActive && styles.titleInactive)}>
          Заполнение данных
        </p>
        <div className={styles.progressRow} onClick={() => onStepClick?.(2)}>
          <ProgressBlock
            progress={step3Progress}
            step={3}
          />
          <p className={clsx(styles.subtitle, getSubtitleClass(2))}>
            Требования к продукту
          </p>
        </div>

        <div className={styles.progressRow} onClick={() => onStepClick?.(3)}>
          <ProgressBlock
            progress={step4Progress}
            step={4}
          />
          <p className={clsx(styles.subtitle, getSubtitleClass(3))}>
            Компетенции
          </p>
        </div>

        <div className={styles.progressRow} onClick={() => onStepClick?.(4)}>
          <ProgressBlock
            progress={step5Progress}
            step={5}
          />
          <p className={clsx(styles.subtitle, getSubtitleClass(4))}>
            Даты и ресурсы
          </p>
        </div>
      </div>

    </aside>
  )
}

interface ProgressBadgeProps {
  step: number,
  progress: number
}

export const ProgressBlock = ({step, progress} : ProgressBadgeProps) => {
  const radius = 14;
  const circumference = 2 * Math.PI * radius;

  const visiblePercent = 0.8;
  const trackLength = circumference * visiblePercent;

  const offset = trackLength - (progress / 100) * trackLength;

  if (progress === 100) {
    return <div className={clsx(styles.badgeBase, styles.completeBadge)}>
      <CheckIcon/>
    </div>
  }

  if (progress === 0) {
    return <div className={clsx(styles.badgeBase, styles.stepBadge)}>
      {step}
    </div>
  }

  return (
    <div className={clsx(styles.badgeBase, styles.progressBadge)}>
      <svg className={styles.svg} viewBox="0 0 32 32">
        <circle
          cx="16"
          cy="16"
          r={radius}
          className={styles.track}
          strokeDasharray={`${trackLength} ${circumference}`}
        />

        <circle
          cx="16"
          cy="16"
          r={radius}
          className={styles.progress}
          strokeDasharray={`${trackLength} ${circumference}`}
          strokeDashoffset={offset}
        />
      </svg>

      <span className={styles.text}>{progress}</span>
    </div>
  )
}

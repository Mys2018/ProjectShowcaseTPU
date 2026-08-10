import styles from './CreateProjectProgressWidget.module.css'
import type {CreateProjectForm} from "@/features/create-project/model/useProjectWizard.ts";
import CheckIcon from '@/shared/ui/icons/check.svg?react'
import clsx from "clsx";
import {useStore} from "@tanstack/react-form";
import {calculateProgress} from "@/shared/utils/progress/calculateProgress.ts";

interface CreateProjectProgressWidgetProps {
  form: CreateProjectForm
}

export const CreateProjectProgressWidget = ({form}: CreateProjectProgressWidgetProps) => {
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
    formValues.checkpoints,
    formValues.links
  ])


  return (
    <aside className={styles.progressBlock}>

      <div className={styles.block}>
        <p className={styles.title}>
          Создание проекта
        </p>
        <div className={styles.progressRow}>
          <ProgressBlock
            progress={step1Progress}
            step={1}
          />
          <p className={styles.subtitle}>
            Выбор типа
          </p>
        </div>

        <div className={styles.progressRow}>
          <ProgressBlock
            progress={step2Progress}
            step={2}
          />
          <p className={styles.subtitle}>
            Основная информация
          </p>
        </div>
      </div>

      <div className={styles.block}>
        <p className={styles.title}>
          Заполнение данных
        </p>
        <div className={styles.progressRow}>
          <ProgressBlock
            progress={step3Progress}
            step={3}
          />
          <p className={styles.subtitle}>
            Требования к продукту
          </p>
        </div>

        <div className={styles.progressRow}>
          <ProgressBlock
            progress={step4Progress}
            step={4}
          />
          <p className={styles.subtitle}>
            Компетенции
          </p>
        </div>

        <div className={styles.progressRow}>
          <ProgressBlock
            progress={step5Progress}
            step={5}
          />
          <p className={styles.subtitle}>
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
  const radius = 11;
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

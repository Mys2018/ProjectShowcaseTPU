import clsx from 'clsx'
import styles from './ProjectPublicStatusLabel.module.css'
import type { ProjectStatus } from '../../model/types.ts'
import { getProjectStatusTranslation } from '../../lib/translations.ts'
import TargetIcon from '@/shared/ui/icons/target.svg?react'

interface ProjectStatusLabelProps {
  status: ProjectStatus
  /**
   * Два состояния одного компонента. `desktop` — плашка с рамкой на странице проекта,
   * `panel` — пилюля 42px в мобильной плавающей панели. Надписи, цвета и иконки
   * общие: поменяются здесь — поменяются сразу в обоих местах.
   */
  variant?: 'desktop' | 'panel'
}

export const ProjectPublicStatusLabel = ({ status, variant = 'desktop' }: ProjectStatusLabelProps) => {
  let Icon
  switch (status) {
    case 'InProgress':
    case 'Rejected':
    case 'Recruiting':
    case 'RecruitmentCompleted': {
      Icon = TargetIcon
    }
  }

  return (
    <span className={clsx(styles.status, styles[status], variant === 'panel' && styles.panel)}>
      {Icon && <Icon className={styles.className} />}
      <p className={styles.label}>{getProjectStatusTranslation(status)}</p>
    </span>
  )
}

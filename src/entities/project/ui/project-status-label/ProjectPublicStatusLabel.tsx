import clsx from 'clsx'
import styles from './ProjectPublicStatusLabel.module.css'
import type { ProjectStatus } from '../../model/types.ts'
import { getProjectStatusTranslation } from '../../lib/translations.ts'
import TargetIcon from '@/shared/ui/icons/target.svg?react'

interface ProjectStatusLabelProps {
  status: ProjectStatus
}

export const ProjectPublicStatusLabel = ({ status }: ProjectStatusLabelProps) => {
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
    <span className={styles.status}>
      {Icon && <Icon className={styles.className} />}
      <p className={clsx(styles.label, styles[status])}>{getProjectStatusTranslation(status)}</p>
    </span>
  )
}

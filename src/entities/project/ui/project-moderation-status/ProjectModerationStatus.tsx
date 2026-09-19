import styles from './ProjectModerationStatus.module.css'
import type { ProjectStatus } from '../../model/types'
import clsx from 'clsx'
import { getModerationStatusIcon } from '../project-icons/ProjectIcons'
import { getModerationStatusTranslation } from '../../lib/translations'

interface ProjectModerationStatusProps {
  status: ProjectStatus
  className?: string
}

export function ProjectModerationStatus({ status, className }: ProjectModerationStatusProps) {
  return <div className={clsx(styles.status, styles[status], className)}>
    {getModerationStatusIcon(status)}
    <p className={styles.label}>{getModerationStatusTranslation(status)}</p>
  </div>
}

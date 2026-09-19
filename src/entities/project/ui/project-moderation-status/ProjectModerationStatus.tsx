import styles from './ProjectModerationStatus.module.css'
import type { ProjectStatus } from '../../model/types'
import clsx from 'clsx'

interface ProjectModerationStatusProps {
  status: ProjectStatus
  className?: string
}

export function ProjectModerationStatus({ status, className }: ProjectModerationStatusProps) {
  return <div className={clsx(styles.status, styles[status.toLowerCase()], className)}></div>
}

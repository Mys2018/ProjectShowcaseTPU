import clsx from 'clsx'
import styles from './ProjectFormatBadge.module.css'
import type { ProjectFormat } from '../../model/types'
import { getProjectFormatTranslation } from '../../lib/translations'
import { getProjectFormatIcon } from '../../lib/icons'

interface ProjectFormatBadgeProps {
  format: ProjectFormat
  className?: string
}

export function ProjectFormatBadge({ format, className }: ProjectFormatBadgeProps) {
  return (
    <div className={clsx(styles.badge, styles[format.toLowerCase()], className)}>
      {getProjectFormatIcon(format)}
      <p>{getProjectFormatTranslation(format)}</p>
    </div>
  )
}

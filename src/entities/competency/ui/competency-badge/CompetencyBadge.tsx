import styles from './CompetencyBadge.module.css'
import type { Competency } from '../../model/types'
import clsx from 'clsx'

interface CompetencyBadgeProps {
  competency: Competency
  className?: string
}

export function CompetencyBadge({ competency, className }: CompetencyBadgeProps) {
  return <div className={clsx(styles.competency, className)}>{competency.name}</div>
}

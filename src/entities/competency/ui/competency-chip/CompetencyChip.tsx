import clsx from 'clsx'
import type { MouseEventHandler } from 'react'
import styles from './CompetencyChip.module.css'
import type { Competency } from '../../model/types'

interface CompetencyChipProps {
  competency: Competency
  active?: boolean
  onClick?: MouseEventHandler<HTMLDivElement>
  className?: string
}

export function CompetencyChip({ competency, active, onClick, className }: CompetencyChipProps) {
  return (
    <div className={clsx(styles.competency, active && styles.active, className)} onClick={onClick}>
      {competency.name}
    </div>
  )
}

import clsx from 'clsx'
import styles from './CompetencyRow.module.css'
import { getCompetencyVerbal } from '../../lib/verbals'
import type { Competency } from '../../model/types'
import { CompetencyIcon } from '../CompetencyIcon'

interface CompetencyRowProps {
  competency: Competency
  className?: string
}

export function CompetencyRow({ competency, className }: CompetencyRowProps) {
  return (
    <div className={clsx(styles.competency, className)}>
      <CompetencyIcon competency={competency} className={styles.icon} />
      <p className={styles.label}>{getCompetencyVerbal(competency.name)}</p>
    </div>
  )
}

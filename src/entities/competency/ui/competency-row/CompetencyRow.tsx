import clsx from 'clsx'
import styles from './CompetencyRow.module.css'
import { getCompetencyVerbal } from '../../lib/verbals'
import type { Competency } from '../../model/types'
import { CompetencyIcon, isPseudoRole } from '../CompetencyIcon'

export interface CompetencyRowProps {
  competency?: Competency | string | null
  role?: string | null
  className?: string
}

export function CompetencyRow({ competency, role, className }: CompetencyRowProps) {
  const roleName =
    role ??
    (typeof competency === 'string' ? competency : competency?.name) ??
    ''

  const cleanRoleName = isPseudoRole(roleName) ? '' : roleName
  const label = cleanRoleName ? getCompetencyVerbal(cleanRoleName) : ''

  return (
    <div className={clsx(styles.competency, className)}>
      <CompetencyIcon role={cleanRoleName} className={styles.icon} />
      {label && <p className={styles.label}>{label}</p>}
    </div>
  )
}

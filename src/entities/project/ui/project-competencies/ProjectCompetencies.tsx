import clsx from 'clsx'
import styles from './ProjectCompetencies.module.css'
import type { ProjectCardData } from '../../model/types'

interface ProjectCompetenciesProps {
  competencies: ProjectCardData['roles']
  rowDirection?: boolean
  className?: string
}

export function ProjectCompetencies({ competencies, rowDirection = false, className }: ProjectCompetenciesProps) {
  return (
    <div className={clsx(styles.competencies, className)}>
      <div className={styles.label}>{competencies.length} компетенций:</div>
      <div className={styles.wrapper}>
        <div className={clsx(styles.list, rowDirection && styles.row)}>
          {competencies.map(competency => (
            <span key={competency.roleId} className={styles.competency}>
              {competency.meta.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

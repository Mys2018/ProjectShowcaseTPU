import styles from '../ProjectInfo.module.css'
import s from './ProjectResources.module.css'
import type { ProjectCardData } from '../../..'
import clsx from 'clsx'

interface ProjectResourcesProps {
  project: ProjectCardData
  className?: string
}

export function ProjectResources({ project, className }: ProjectResourcesProps) {
  const { repository, taskTracker, otherPlatforms } = project
  const resources = [...(repository ?? []), ...(taskTracker ?? []), ...(otherPlatforms ?? [])]
  if (!resources.length) return null
  return (
    <div className={clsx(styles.block, className)}>
      <h3 className={styles.heading}>Ресурсы</h3>
      {resources.map(resource => (
        <div className={s.resource} key={resource.platformId}>
          <p className={s.title}>{resource.name}</p>
          <p className={s.label}>{resource.url}</p>
        </div>
      ))}
    </div>
  )
}

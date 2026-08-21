import styles from './ProjectTags.module.css'
import clsx from 'clsx'
import type { ProjectTag } from '../../model/types'

interface ProjectTagsProps {
  tags: ProjectTag[]
  visibleCount?: number
  className?: string
}

export function ProjectTags({ tags, visibleCount, className }: ProjectTagsProps) {
  const visibleTags = tags.filter((_, i) => !visibleCount || i < visibleCount)
  const remaining = tags.length - visibleTags.length
  return (
    <div className={clsx(styles.tags, className)}>
      {visibleTags.map(tag => (
        <div key={tag.tagId} className={styles.tag}>
          {tag.tagName}
        </div>
      ))}
      {remaining > 0 && <p className={styles.label}>Ещё +{remaining}</p>}
    </div>
  )
}

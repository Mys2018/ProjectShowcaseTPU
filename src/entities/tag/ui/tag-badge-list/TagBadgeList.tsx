import clsx from 'clsx'
import styles from './TagBadgeList.module.css'
import type { Tag } from '../../model/types'
import { TagBadge } from '../tag-badge/TagBadge'

interface TagBadgeListProps {
  tags: Tag[]
  visibleCount?: number
  className?: string
}

export function TagBadgeList({ tags, visibleCount, className }: TagBadgeListProps) {
  const visibleTags = tags.filter((_, i) => !visibleCount || i < visibleCount)
  const remaining = tags.length - visibleTags.length
  return (
    <div className={clsx(styles.tags, className)}>
      {visibleTags.map(tag => (
        <TagBadge key={tag.id} tag={tag} />
      ))}
      {remaining > 0 && <p className={styles.label}>Ещё +{remaining}</p>}
    </div>
  )
}

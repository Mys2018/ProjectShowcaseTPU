import clsx from 'clsx'
import styles from './TagBadge.module.css'
import type { Tag } from '../../model/types'

interface TagBadgeProps {
  tag: Tag
	className?: string
}

export function TagBadge({ tag, className }: TagBadgeProps) {
  return <div className={clsx(styles.tag, className)}>{tag.name}</div>
}

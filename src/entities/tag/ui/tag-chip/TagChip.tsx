import clsx from 'clsx'
import type { MouseEventHandler } from 'react'
import styles from './TagChip.module.css'
import type { Tag } from '../../model/types'

interface TagChipProps {
  tag: Tag
  active?: boolean
  onClick?: MouseEventHandler<HTMLDivElement>
  className?: string
}

export function TagChip({ tag, active, className, onClick }: TagChipProps) {
  return (
    <div className={clsx(styles.tag, active && styles.active, className)} onClick={onClick}>
      {tag.name}
    </div>
  )
}

import clsx from 'clsx'
import styles from './UserRow.module.css'
import { ImageSkeleton, TextSkeleton } from '@/shared'

interface UserRowSkeletonProps {
  className?: string
}

export function UserRowSkeleton({ className }: UserRowSkeletonProps) {
  return (
    <div className={clsx(styles.container, className)}>
      <ImageSkeleton className={styles.avatar} />
      <div className={clsx(styles.info, styles.skeleton)}>
        <TextSkeleton rows={2} />
      </div>
    </div>
  )
}

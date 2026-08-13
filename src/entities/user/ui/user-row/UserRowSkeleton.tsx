import styles from './UserRow.module.css'
import { ImageSkeleton, TextSkeleton } from '@/shared'

interface UserRowSkeletonProps {
  className?: string
}

export function UserRowSkeleton({ className }: UserRowSkeletonProps) {
  return (
    <div className={`${styles.container} ${className ?? ''}`}>
      <ImageSkeleton className={styles.avatar} />
      <TextSkeleton className={styles.info} rows={2} />
    </div>
  )
}

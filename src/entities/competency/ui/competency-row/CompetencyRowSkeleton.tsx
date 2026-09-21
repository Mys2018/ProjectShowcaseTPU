import clsx from 'clsx'
import styles from './CompetencyRow.module.css'
import { ImageSkeleton, TextSkeleton } from '@/shared'

interface CompetencyRowSkeletonProps {
  className?: string
}

export function CompetencyRowSkeleton({ className }: CompetencyRowSkeletonProps) {
  return (
    <div className={clsx(styles.competency, className)}>
      <ImageSkeleton className={styles.icon} />
      <TextSkeleton className={styles.label} />
    </div>
  )
}

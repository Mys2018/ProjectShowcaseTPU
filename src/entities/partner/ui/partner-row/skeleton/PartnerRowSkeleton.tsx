import clsx from 'clsx'
import styles from '../PartnerRow.module.css'
import s from './PartnerRowSkeleton.module.css'
import { ImageSkeleton, TextSkeleton } from '@/shared'

interface PartnerRowSkeletonProps {
  clickable?: boolean
  className?: string
}

export function PartnerRowSkeleton({ clickable, className }: PartnerRowSkeletonProps) {
  return (
    <div className={clsx(styles.partner, clickable && styles.clickable, className)}>
      <ImageSkeleton className={styles.picture} />
      <div className={s.info}>
        <TextSkeleton rows={2} />
      </div>
    </div>
  )
}

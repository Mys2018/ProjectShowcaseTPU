import styles from './InviteRow.module.css'
import { ImageSkeleton, TextSkeleton } from '@/shared'

export function InviteRowSkeleton() {
  return (
    <div className={styles.rowContainer} aria-busy="true">
      <div className={styles.left}>
        <ImageSkeleton style={{ width: 48, height: 48, borderRadius: '50%', flexShrink: 0 }} />
        <div className={styles.innerRight} style={{ flex: 1 }}>
          <div className={styles.info} style={{ width: '80%' }}>
            <TextSkeleton rows={2} />
          </div>
          <div className={styles.buttonContainer}>
            <ImageSkeleton style={{ width: 88, height: 32, borderRadius: 20 }} />
            <ImageSkeleton style={{ width: 88, height: 32, borderRadius: 20 }} />
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <TextSkeleton rows={1} style={{ width: 60 }} />
      </div>
    </div>
  )
}

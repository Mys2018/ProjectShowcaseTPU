import { ImageSkeleton, TextSkeleton } from '@/shared'
import styles from './SomeoneProfileHeader.module.css'

export function SomeoneProfileHeaderSkeleton() {
  return (
    <div className={styles.container} aria-busy="true" aria-label="Загрузка профиля пользователя">
      <div className={styles.header}>
        <div className={styles.bioBlock}>
          <ImageSkeleton className={styles.avatar} />
          <div className={styles.infoBlock} style={{ width: '60%' }}>
            <div className={styles.nameBlock}>
              <TextSkeleton rows={2} />
            </div>
            <div className={styles.groupBlock}>
              <TextSkeleton rows={1} style={{ width: 100 }} />
            </div>
          </div>
        </div>

        <div className={styles.linkBlock}>
          <div className={styles.headerLink}>
            <p>Контакты</p>
            <TextSkeleton rows={1} style={{ width: 120 }} />
          </div>
          <div className={styles.linkList}>
            <ImageSkeleton style={{ height: 38, flex: 1, borderRadius: 12 }} />
            <ImageSkeleton style={{ height: 38, flex: 1, borderRadius: 12 }} />
            <ImageSkeleton style={{ height: 38, flex: 1, borderRadius: 12 }} />
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <p className={styles.footerTitle}>О себе</p>
        <TextSkeleton rows={3} />
      </div>
    </div>
  )
}

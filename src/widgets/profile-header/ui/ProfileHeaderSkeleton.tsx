import { ImageSkeleton, TextSkeleton } from '@/shared'
import styles from './ProfileHeader.module.css'

export const ProfileHeaderSkeleton = () => {
  return (
    <div className={styles.mainInfo} aria-busy="true" aria-label="Загрузка профиля">
      <div className={styles.infoGrid}>
        <section className={styles.mainInfoContainer}>
          <ImageSkeleton className={styles.avatar} />
          <div className={styles.nameContainer} style={{ width: '60%' }}>
            <TextSkeleton rows={2} />
          </div>
        </section>

        <section className={styles.editBody}>
          <TextSkeleton rows={2} />
        </section>

        <section className={styles.secondInfoContainer}>
          <div className={styles.header}>
            <div className={styles.contactsText}>
              <h1>Контакты</h1>
              <p>для командного взаимодействия.</p>
            </div>
            <div className={styles.emailContainer}>
              <TextSkeleton rows={1} style={{ width: 140 }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <ImageSkeleton style={{ width: 100, height: 36, borderRadius: 12 }} />
            <ImageSkeleton style={{ width: 100, height: 36, borderRadius: 12 }} />
          </div>
        </section>
      </div>
    </div>
  )
}

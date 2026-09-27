import styles from '../MyProfile.module.css'
import { ProfileHeaderSkeleton } from '@/widgets/profile-header'
import { BackLink } from '@/shared/ui/back-link'
import { ImageSkeleton, ROUTES, TextSkeleton } from '@/shared'

export function MyProfileSkeleton() {
  return (
    <div className={styles.mainContent} aria-busy="true" aria-label="Загрузка профиля">
      <BackLink fallback={ROUTES.MAIN} className={styles.headerLeft} />

      <section className={styles.pageTitle}>
        <h2>Мой профиль</h2>
      </section>

      <section className={styles.profile}>
        <ProfileHeaderSkeleton />
        <div className={styles.body}>
          <div style={{ flex: 1, background: 'var(--color-gray-50)', padding: 24, borderRadius: 20 }}>
            <TextSkeleton rows={1} style={{ width: 120, height: 24, marginBottom: 16 }} />
            <TextSkeleton rows={3} />
          </div>

          <div style={{ flex: 1, background: 'var(--color-gray-50)', padding: 24, borderRadius: 20 }}>
            <TextSkeleton rows={1} style={{ width: 140, height: 24, marginBottom: 16 }} />
            <TextSkeleton rows={3} />
          </div>

          <div style={{ flex: 1, background: 'var(--color-gray-50)', padding: 24, borderRadius: 20 }}>
            <TextSkeleton rows={1} style={{ width: 160, height: 24, marginBottom: 16 }} />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <ImageSkeleton style={{ width: 110, height: 32, borderRadius: 16 }} />
              <ImageSkeleton style={{ width: 90, height: 32, borderRadius: 16 }} />
              <ImageSkeleton style={{ width: 130, height: 32, borderRadius: 16 }} />
            </div>
          </div>

          <div style={{ flex: 1, background: 'var(--color-gray-50)', padding: 24, borderRadius: 20 }}>
            <TextSkeleton rows={1} style={{ width: 100, height: 24, marginBottom: 16 }} />
            <TextSkeleton rows={1} style={{ width: '80%', height: 40 }} />
          </div>
        </div>
      </section>
    </div>
  )
}

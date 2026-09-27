import styles from './CreateProjectPage.module.css'
import BackIcon from '@/shared/ui/icons/back.svg?react'
import { ImageSkeleton, TextSkeleton } from '@/shared'

interface CreateProjectSkeletonProps {
  title?: string
}

export function CreateProjectSkeleton({ title }: CreateProjectSkeletonProps) {
  return (
    <div className={styles.formPageWrapper} aria-busy="true" aria-label="Загрузка конструктора проекта">
      <main className={styles.mainContent}>
        <div className={styles.headerLeft}>
          <BackIcon />
          <TextSkeleton rows={1} style={{ width: 90 }} />
        </div>

        <h1 className={styles.title}>
          {title ? `${title} — Загрузка…` : <TextSkeleton rows={1} style={{ width: 350, height: 32 }} />}
        </h1>

        <section className={styles.progressBlock}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <ImageSkeleton style={{ width: '100%', height: 44, borderRadius: 12 }} />
            <ImageSkeleton style={{ width: '100%', height: 44, borderRadius: 12 }} />
            <ImageSkeleton style={{ width: '100%', height: 44, borderRadius: 12 }} />
            <ImageSkeleton style={{ width: '100%', height: 44, borderRadius: 12 }} />
          </div>
        </section>

        <section className={styles.body}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <TextSkeleton rows={1} style={{ width: 140, height: 16, marginBottom: 8 }} />
              <ImageSkeleton style={{ width: '100%', height: 48, borderRadius: 12 }} />
            </div>
            <div>
              <TextSkeleton rows={1} style={{ width: 180, height: 16, marginBottom: 8 }} />
              <ImageSkeleton style={{ width: '100%', height: 48, borderRadius: 12 }} />
            </div>
            <div>
              <TextSkeleton rows={1} style={{ width: 120, height: 16, marginBottom: 8 }} />
              <ImageSkeleton style={{ width: '100%', height: 120, borderRadius: 12 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
              <ImageSkeleton style={{ width: 120, height: 44, borderRadius: 50 }} />
              <ImageSkeleton style={{ width: 140, height: 44, borderRadius: 50 }} />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

import styles from './ProjectPageSkeleton.module.css'
import { BackLink } from '@/shared/ui/back-link'
import { ROUTES } from '@/shared'
import { ImageSkeleton, TextSkeleton } from '@/shared'
import { UserRowSkeleton } from '@/entities/user'

interface ProjectPageSkeletonProps {
  isMobile?: boolean
}

export function ProjectPageSkeleton({ isMobile }: ProjectPageSkeletonProps) {
  if (isMobile) {
    return (
      <main className={styles.mobileMain} aria-busy="true" aria-label="Загрузка проекта">
        <section className={styles.mobileTopBlock}>
          <div className={styles.tagRow}>
            <ImageSkeleton className={styles.tagChip} />
            <ImageSkeleton className={styles.tagChip} />
          </div>
          <ImageSkeleton className={styles.chip} style={{ width: 40 }} />
        </section>

        <section className={styles.mobileTitle}>
          <TextSkeleton className={styles.mobileTitleSkeleton} />
        </section>

        <div className={styles.mobileContent}>
          <div className={styles.infoBanner}>
            <div className={styles.tagRow}>
              <ImageSkeleton className={styles.tagChip} />
              <ImageSkeleton className={styles.tagChip} />
            </div>
            <UserRowSkeleton />
            <TextSkeleton rows={3} />
          </div>

          <div className={styles.cardSkeleton}>
            <TextSkeleton rows={4} />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.desktopMain} aria-busy="true" aria-label="Загрузка проекта">
      <BackLink fallback={ROUTES.PROJECTS.RECRUITMENT} className={styles.headerLeft} />

      <aside className={styles.leftWidgets}>
        <div className={styles.cardSkeleton}>
          <UserRowSkeleton />
        </div>
        <div className={styles.cardSkeleton}>
          <TextSkeleton rows={2} />
        </div>
        <div className={styles.cardSkeleton}>
          <TextSkeleton rows={2} />
        </div>
      </aside>

      <section className={styles.titleArea}>
        <TextSkeleton className={styles.titleSkeleton} />
      </section>

      <section className={styles.projectsInfo}>
        <div className={styles.infoBanner}>
          <div className={styles.tagRow}>
            <ImageSkeleton className={styles.tagChip} />
            <ImageSkeleton className={styles.tagChip} />
            <ImageSkeleton className={styles.tagChip} />
          </div>
          <UserRowSkeleton />
          <TextSkeleton rows={3} />
        </div>

        <div className={styles.cardSkeleton}>
          <TextSkeleton rows={6} />
        </div>
      </section>

      <aside className={styles.rightWidgets}>
        <ImageSkeleton className={styles.statusPill} />
        <div className={styles.cardSkeleton}>
          <TextSkeleton rows={1} />
          <div className={styles.chipList}>
            <ImageSkeleton className={styles.chip} />
            <ImageSkeleton className={styles.chip} />
            <ImageSkeleton className={styles.chip} />
          </div>
        </div>
        <div className={styles.cardSkeleton}>
          <TextSkeleton rows={1} />
          <UserRowSkeleton />
          <UserRowSkeleton />
        </div>
      </aside>
    </main>
  )
}

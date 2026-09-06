import styles from './CuratorWidget.module.css'
import { CuratorProjectCard, DraftProjectCard } from '@/features/platform-project-cards'
import { useProjectDraft } from '@/entities/draft'
import { useCuratedProjects } from "@/entities/project";

export const CuratorWidget = () => {

  const { data: draft, isLoading } = useProjectDraft()
  const { data: curatorData } = useCuratedProjects()

  return (
    <section className={styles.bodyContainer}>
      {
        draft && (
          <div className={styles.bigBlock}>
            <div className={styles.headerRow}>
              <h3 className={styles.title}>Черновик проекта</h3>
            </div>

            {isLoading ? (
              <div className={styles.loadingContainer}>
                <p className={styles.loadingText}>Загрузка черновика...</p>
              </div>
            ) : draft ? (
              <DraftProjectCard draft={draft} />
            ) : null}
          </div>
        )
      }
      {
        curatorData && (
          <div className={styles.bigBlock}>
            <div className={styles.headerRow}>
              <h3 className={styles.title}>Проекты в управлении</h3>
            </div>
            <div className={styles.projectList}>
              {
                curatorData.projects.map((project) => (
                  <CuratorProjectCard key={project.id} project={project}/>
                ))
              }
            </div>
          </div>
        )
      }
    </section>
  )
}

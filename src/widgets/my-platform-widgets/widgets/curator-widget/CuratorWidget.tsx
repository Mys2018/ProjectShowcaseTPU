import { useState } from "react";
import styles from './CuratorWidget.module.css';
import { CuratorProjectCard, DraftProjectCard } from '@/features/platform-project-cards';
import { useProjectDraft } from '@/entities/draft';
import { useCuratedProjects } from "@/entities/project";
import { ProjectSkeleton } from "@/shared";
import GradingReminder from '@/shared/assets/3d/Grading_Reminder.png';
import { ClosingBanner } from "@/shared/ui/closing-banner";

export const CuratorWidget = () => {

  const { data: draft, isLoading: draftProjectLoading } = useProjectDraft()
  const { data: curatorData, isLoading: curatedProjectLoading } = useCuratedProjects()
  const [isBannerVisible, setIsBannerVisible] = useState<boolean>(true)

  return (
    <section className={styles.bodyContainer}>

      <ClosingBanner
        backgroundClass={styles.banner}
        title={'Не забывайте оценивать работу команды'}
        description={'Каждую неделю отмечайте результаты участников проекта. Если оценки не будут выставлены до конца спринта, оценивание проекта будет временно заблокировано.'}
        isBannerVisible={isBannerVisible}
        setIsBannerVisible={() => setIsBannerVisible(false)}
        image={GradingReminder}
        greenClickableLabelFun={() => {} }
        greenClickableLabelText={'Узнать подробнее'}
      />
      {
        draft && (
          <div className={styles.bigBlock}>
            <div className={styles.headerRow}>
              <h3 className={styles.title}>Черновик проекта</h3>
            </div>

            {draftProjectLoading ? (
              <ProjectSkeleton/>
            ) : draft ? (
              <DraftProjectCard draft={draft} />
            ) : null}
          </div>
        )
      }
      <div className={styles.bigBlock}>
        <div className={styles.headerRow}>
          <h3 className={styles.title}>Проекты в управлении</h3>
        </div>
        <div className={styles.projectList}>
          {
            curatedProjectLoading ? (
              <>
                <ProjectSkeleton className={styles.skeleton}/>
                <ProjectSkeleton className={styles.skeleton}/>
              </>

            ) : (curatorData && curatorData.projects.map((project) => (
              <CuratorProjectCard key={project.id} project={project}/>
            )))
          }
        </div>
      </div>
    </section>
  )
}

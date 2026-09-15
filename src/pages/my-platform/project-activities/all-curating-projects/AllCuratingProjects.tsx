import styles from './AllCuratingProjects.module.css'
import {CuratorProjectCard} from "@/features/platform-project-cards";
import {AddProjectElement, CompletedProjects, NoProjectsFallback, useCuratedProjects} from "@/entities/project";
import {ProjectSkeleton, ROUTES} from "@/shared";
import {useNavigate} from "react-router-dom";

export const AllCuratingProjects = () => {
  const { data: curatorData, isLoading: curatedProjectLoading } = useCuratedProjects({ limit: 100 })
  const navigate = useNavigate();

  const projects = curatorData?.projects || []
  const activeProjects = projects.filter(p => p.status !== 'Completed' && p.status !== 'NotImplemented' && p.status !== 'Rejected')
  const completedProjects = projects.filter(p => p.status === 'Completed' || p.status === 'NotImplemented' || p.status === 'Rejected')
  const hasActiveProjects = activeProjects.length > 0
  const hasCompletedProjects = completedProjects.length > 0

  return (
    <div className={styles.container}>
      <div className={styles.activeContainer}>
        <h3 className={styles.title}>
          Активные проекты
        </h3>
        {curatedProjectLoading ? (
          <>
            <ProjectSkeleton className={styles.skeleton} />
            <ProjectSkeleton className={styles.skeleton} />
          </>
        ) : hasActiveProjects ? (
          <>
            {activeProjects.map((project) => (
              <CuratorProjectCard key={project.id} project={project} />
            ))}
            <AddProjectElement />
          </>
        ) : (
          <NoProjectsFallback
            title={'Активных проектов сейчас нет'}
            description={'Создавайте проекты, привлекайте студентов и развивайте команды. Ваши активные проекты будут отображаться здесь.'}
            buttonType={'blue'}
            buttonText={'Создать новый проект'}
            onClick={() => {
              navigate(ROUTES.PROJECTS.CREATE)
            }}
          />
        )}
      </div>

      <CompletedProjects
        title={'Завершенные проекты'}
        isEmpty={!hasCompletedProjects}
        emptyTitle={'В 2026 году вы не управляли проектами'}
        emptySubtitle={'Создавайте проекты и управляйте командами. Все завершенные проекты будут храниться здесь вместе с результатами и статистикой.'}
      >
        {completedProjects.map((project) => (
          <CuratorProjectCard key={project.id} project={project} />
        ))}
      </CompletedProjects>
    </div>
  )
}

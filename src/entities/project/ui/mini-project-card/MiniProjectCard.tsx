import styles from './MiniProjectCard.module.css';
import { ProjectCardHeader } from '../project-card-header/ProjectCardHeader';
import { type ProjectCardData, ProjectCardTeam } from '@/entities/project';
import { type Application, useApplications } from "@/entities/application";

type MiniProjectCardType = 'applications' | 'rating'

interface MiniProjectCardProps {
  project: ProjectCardData
  type: MiniProjectCardType
}

export const MiniProjectCard = ({project, type}: MiniProjectCardProps) => {

  const {data: applications} = useApplications({
    mode: 'AsOwner',
    projectId: project.id,
    offset: 0,
    limit: 10,
  })

  return (
    <div className={styles.container}>
      <ProjectCardHeader className={styles.header} label={project.primaryTag.name}/>
      <div className={styles.body}>
        <p>
          {project.meta.title}
        </p>
        <div className={styles.footer}>
          <div className={styles.labels}>
            {applications && type === 'applications' && (
              <p className={styles.totalApplications}>
                Всего откликов: {applications.applications.filter(
                  (application: Application) => application.status === 'pending'
                ).length}
              </p>
            )}
          </div>
          <ProjectCardTeam
            members={project.team ? project.team.map(m => ({
              id: m.userId,
              firstName: m.meta?.firstName || '',
              lastName: m.meta?.lastName || '',
              profilePicture: m.profilePicture,
              roles: m.roles,
            })) : undefined}
            max={3}
          />
        </div>
      </div>

    </div>
  )
}

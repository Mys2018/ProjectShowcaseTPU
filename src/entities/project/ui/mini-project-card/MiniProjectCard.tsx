import styles from './MiniProjectCard.module.css';
import { ProjectCardHeader } from '../project-card-header/ProjectCardHeader';
import {type ProjectCardData, ProjectCardTeam, useProjectTeam} from '@/entities/project';
import { useApplications } from "@/entities/application";

type MiniProjectCardType = 'applications' | 'rating'

interface MiniProjectCardProps {
  project: ProjectCardData
  type: MiniProjectCardType
}

export const MiniProjectCard = ({project, type}: MiniProjectCardProps) => {

  const { data: applications } = useApplications({
    mode: 'AsOwner',
    projectId: project.id,
    status: 'pending',
    offset: 0,
    limit: 1,
  })

  const { data: team } = useProjectTeam(project.id)

  return (
    <div className={styles.container}>
      <ProjectCardHeader className={styles.header} label={project.primaryTag.name} />
      <div className={styles.body}>
        <p>
          {project.meta.title}
        </p>
        <div className={styles.footer}>
          <div className={styles.labels}>
            {applications && type === 'applications' && (
              <p className={styles.totalApplications}>
                Всего откликов: {applications.total}
              </p>
            )}
          </div>

          <ProjectCardTeam
            members={team}
            max={4}
            project={project}
          />
        </div>
      </div>

    </div>
  )
}

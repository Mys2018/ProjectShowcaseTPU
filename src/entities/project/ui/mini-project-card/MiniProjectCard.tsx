import clsx from 'clsx';
import styles from './MiniProjectCard.module.css';
import { ProjectCardHeader } from '../project-card-header/ProjectCardHeader';
import {type ProjectCardData, ProjectCardTeam, useProjectTeam} from '@/entities/project';
import { useApplications } from "@/entities/application";

export type MiniProjectCardType = 'applications' | 'rating' | 'moderation'

export interface MiniProjectCardProps {
  project: ProjectCardData
  type?: MiniProjectCardType
  headerSlot?: React.ReactNode
  className?: string
}

export const MiniProjectCard = ({project, type, headerSlot, className}: MiniProjectCardProps) => {
  const isApplications = type === 'applications';
  const isModeration = type === 'moderation';

  const { data: applications } = useApplications({
    mode: 'AsOwner',
    projectId: project.id,
    type: 'Application',
    status: 'pending',
    offset: 0,
    limit: 1,
  }, isApplications)

  const { data: team } = useProjectTeam(project.id)

  return (
    <div className={clsx(styles.container, className)}>
      {headerSlot && (
        <div className={styles.headerSlot}>
          {headerSlot}
        </div>
      )}
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

          {
            !isModeration && <ProjectCardTeam
              members={team}
              max={4}
              project={project}
            />
          }

        </div>
      </div>

    </div>
  )
}

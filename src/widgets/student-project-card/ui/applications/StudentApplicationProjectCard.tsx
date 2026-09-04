import clsx from 'clsx'
import styles from './StudentApplicationProjectCard.module.css'
import { PartnerRow, PartnerRowSkeleton, usePartnerById } from '@/entities/partner'
import { ProjectCardHorizontal, useProjectDetails } from '@/entities/project'
import { getSortedTags, TagBadgeList } from '@/entities/tag'
import { useUserById } from '@/entities/user'
import { ImageSkeleton, TextSkeleton } from '@/shared'

interface StudentApplicationProjectCardProps {
  projectId: string
	className?: string
  // application: Application
}

export function StudentApplicationProjectCard({ projectId, className }: StudentApplicationProjectCardProps) {
  const { data: project } = useProjectDetails(projectId)
  const { data: partner } = usePartnerById(project!.partnerId, project !== undefined)
  const { data: curator } = useUserById(project!.ownerId, project !== undefined)
  // const { data: competencies } = useCompetencies()
	
	console.log(project?.status)
	
  if (!project) return

  return (
    <ProjectCardHorizontal
      className={clsx(styles.card, className)}
      project={project}
      headerSlot={
        project.status === 'active' ? (
          <div className={styles.header}>
            <TagBadgeList tags={getSortedTags(project.tags, project.primaryTag)} visibleCount={2} />
            <span>{/* TODO application status */}</span>
          </div>
        ) : undefined
      }
      mainSlot={partner ? <PartnerRow partner={partner} /> : <PartnerRowSkeleton />}
      sideSlot={
        <>
          <span className={styles.divider} />
          <div className={styles.side}>
            {/* <div className={styles.competency}>
              <p className={styles.label}>Компетенция:</p>
              <CompetencyBadge competency={competencies.find(c => c.id === application.id)} />
            </div> */}
            <div className={styles.curator}>
              <p className={styles.label}>Наставник:</p>
              <div className={styles.userRow}>
                {curator ? (
                  <>
                    <img className={styles.image} src={curator.profilePicture} loading='lazy' />
                    <p className={styles.name}>{curator.meta.name}</p>
                  </>
                ) : (
                  <>
                    <ImageSkeleton className={styles.image} />
                    <TextSkeleton className={styles.name} />
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      }
      footerSlot={
        project.status === 'active' ? (
          <div className={styles.footer}>
            <span>{/* TODO application cancel */}</span>
            <p className={styles.applicationDate}>Отклик от {/* TODO application createdAt */}</p>
          </div>
        ) : undefined
      }
    />
  )
}

import clsx from 'clsx'
import styles from './StudentApplicationProjectCard.module.css'
import { PartnerRow, PartnerRowSkeleton, usePartnerById } from '@/entities/partner'
import { ProjectCardHorizontal, useProjectDetails } from '@/entities/project'
import { getSortedTags, TagBadgeList } from '@/entities/tag'
import { useUserById } from '@/entities/user'
import { ApplicationStatusBadge, type Application } from '@/entities/application'
import { CompetencyBadge, CompetencyRowSkeleton, useCompetencies } from '@/entities/competency'
import { ClockIcon, ImageSkeleton, TextSkeleton } from '@/shared'

interface StudentApplicationProjectCardProps {
  application: Application
  className?: string
}

export function StudentApplicationProjectCard({ application, className }: StudentApplicationProjectCardProps) {
  const { data: project } = useProjectDetails(application.projectId)
  const { data: partner } = usePartnerById(project!.partnerId, project !== undefined)
  const { data: curator } = useUserById(project!.ownerId, project !== undefined)
  const { data: competencies } = useCompetencies()

  if (!project) return

  const targetCompetency = competencies?.find(c => c.id === application.roleID)
  const isExtended = project.status === 'Recruiting' || project.status === 'Pending'

  const statusBadge =
    project.status === 'Recruiting' ? (
      <div className={clsx(styles.statusBadge, !isExtended && styles.topRight)}>
        <ClockIcon />
        <p>Ожидает окончания набора</p>
      </div>
    ) : (
      <ApplicationStatusBadge className={clsx(!isExtended && styles.topRight)} status={application.status} />
    )

  return (
    <ProjectCardHorizontal
      className={clsx(styles.card, className)}
      project={project}
      headerSlot={
        isExtended ? (
          <div className={styles.header}>
            <TagBadgeList tags={getSortedTags(project.tags, project.primaryTag)} visibleCount={2} />
            {statusBadge}
          </div>
        ) : undefined
      }
      mainSlot={partner ? <PartnerRow partner={partner} /> : <PartnerRowSkeleton />}
      sideSlot={
        <div className={styles.side}>
          <div className={styles.competency}>
            <p className={styles.label}>Компетенция:</p>
            {targetCompetency ? <CompetencyBadge competency={targetCompetency} /> : <CompetencyRowSkeleton className={styles.skeleton} />}
          </div>

          <div className={styles.curator}>
            <p className={styles.label}>Наставник:</p>
            <div className={clsx(styles.userRow, !curator && styles.skeleton)}>
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
          {!isExtended && (
            <>
              {statusBadge}
              <p className={clsx(styles.applicationDate, styles.bottomRight)}>{/* TODO application createdAt */}</p>
            </>
          )}
        </div>
      }
      footerSlot={
        isExtended ? (
          <div className={styles.footer}>
            <span>{/* TODO application cancel */}</span>
            <p className={styles.applicationDate}>Отклик от {/* TODO application createdAt */}</p>
          </div>
        ) : undefined
      }
    />
  )
}

import clsx from 'clsx'
import styles from './StudentApplicationProjectCard.module.css'
import { CancelApplicationButton } from '@/features/cancel-application'
import { PartnerRow } from '@/entities/partner'
import { ProjectCardHorizontal, useProjectDetails } from '@/entities/project'
import { getSortedTags, TagBadgeList } from '@/entities/tag'
import {useUserById, TeamUserCard, Avatar, getAvatarRoleInfo} from '@/entities/user'
import { ApplicationStatusBadge, type Application } from '@/entities/application'
import { CompetencyBadge, CompetencyRowSkeleton, useCompetencies } from '@/entities/competency'
import { ClockIcon, ImageSkeleton, mapDateToLocalString, ProjectSkeleton, TextSkeleton } from '@/shared'

interface StudentApplicationProjectCardProps {
  application: Application
  className?: string
  skeletonClassName?: string
}

export function StudentApplicationProjectCard({ application, className, skeletonClassName }: StudentApplicationProjectCardProps) {
  const { data: project } = useProjectDetails(application.projectId)
  const partner = project?.partner
  const { data: curator } = useUserById(project?.ownerId, Boolean(project?.ownerId))
  const { data: competencies } = useCompetencies()

  if (!project) {
    return <ProjectSkeleton className={clsx(styles.card, skeletonClassName, className)} />
  }

  const targetCompetency = competencies?.find(c => c.id === application.roleID)
  const isExtended = application.status === 'pending'

  const statusBadge =
    project.status === 'Recruiting' && application.status === 'pending' ? (
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
      mainSlot={partner ? <PartnerRow partner={partner} /> : undefined}
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
                <TeamUserCard
                  avatar={
                  <Avatar
                    picture={curator.profilePicture}
                    fallbackType={getAvatarRoleInfo(curator.roles)?.fallback || 'user'}
                    size={"36px"}
                    strokeColor={"grey"}
                  />
                  }
                  firstName={curator.meta.firstName}
                  lastName={curator.meta.lastName}
                  nameStyle='normal'
                  nameTextStyle='bodySmall'
                  nameSubtextStyle='OS-10-400'
                />
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
              <p className={clsx(styles.applicationDate, styles.bottomRight)}>
                {mapDateToLocalString(application.createdAt, { time: true })}
              </p>
            </>
          )}
        </div>
      }
      footerSlot={
        isExtended ? (
          <div className={styles.footer}>
            <CancelApplicationButton applicationId={application.applicationID} />
            <p className={styles.applicationDate}>Отклик от {mapDateToLocalString(application.createdAt, { year: true })}</p>
          </div>
        ) : undefined
      }
    />
  )
}

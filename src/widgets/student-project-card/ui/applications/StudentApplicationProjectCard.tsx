import clsx from 'clsx'
import styles from './StudentApplicationProjectCard.module.css'
import { CancelApplicationButton } from '@/features/cancel-application'
import { PartnerRow } from '@/entities/partner'
import { ProjectCardHorizontal, ProjectCardTeam, useProjectDetails, useProjectTeam } from '@/entities/project'
import { getSortedTags, TagBadgeList } from '@/entities/tag'
import { useUserById, TeamUserCard, Avatar, getAvatarRoleInfo, useMe, getMemberRoleName } from '@/entities/user'
import { ApplicationStatusBadge, type Application } from '@/entities/application'
import { CompetencyRow, useCompetencies } from '@/entities/competency'
import { ClockIcon, ImageSkeleton, mapDateToLocalString, ProjectSkeleton, TextSkeleton } from '@/shared'

interface StudentApplicationProjectCardProps {
  application: Application
  className?: string
  skeletonClassName?: string
}

export function StudentApplicationProjectCard({ application, className, skeletonClassName }: StudentApplicationProjectCardProps) {
  const { data: project } = useProjectDetails(application.projectId)
  const { data: curator } = useUserById(project?.ownerId, Boolean(project?.ownerId))
  const { data: team = [] } = useProjectTeam(project?.id ?? '', Boolean(project?.id))
  const { data: competencies } = useCompetencies()
  const { data: me } = useMe()

  if (!project) {
    return <ProjectSkeleton className={clsx(styles.card, skeletonClassName, className)} />
  }

  const roleForApplication = project.roles?.find(r => r.roleId === application.roleID || r.roleTypeId === application.roleID)
  const targetCompetency = competencies?.find(c => c.id === application.roleID || (roleForApplication && c.id === roleForApplication.roleTypeId))
  const studentUserId = application.studentID || (me?.id ? Number(me.id) : undefined)
  const memberRole = studentUserId ? getMemberRoleName(studentUserId, project) : undefined
  const roleName = (memberRole && memberRole !== 'Участник' ? memberRole : undefined) || roleForApplication?.meta?.name || targetCompetency?.name || 'Участник'

  const displayCompetency = {
    id: targetCompetency?.id || roleForApplication?.roleTypeId || application.roleID || '',
    name: roleName,
  }
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
      mainSlot={<PartnerRow partner={project.partner} />}
      sideSlot={
        <div className={styles.sideSlot}>
          <div className={styles.headerSide}>
            {team.length > 0 && (
              <div className={styles.block}>
                <p>Команда:</p>
                <ProjectCardTeam members={team} max={3} label="" project={project} />
              </div>
            )}
            {displayCompetency && (
              <div className={styles.block}>
                <p>Компетенция:</p>
                <CompetencyRow
                  competency={displayCompetency}
                  className={styles.competencyText}
                  />
              </div>
            )}
          </div>
          {curator ? (
            <div className={styles.block}>
              <p>Наставник:</p>
              <TeamUserCard
                avatar={
                  <Avatar
                    picture={curator.profilePicture}
                    fallbackType={getAvatarRoleInfo(curator.roles)?.fallback || 'user'}
                    size="36px"
                    strokeColor="grey"
                  />
                }
                firstName={curator.meta.firstName}
                lastName={curator.meta.lastName}
                nameStyle="normal"
                nameTextStyle="bodySmall"
                nameSubtextStyle="OS-12-350"
              />
            </div>
          ) : (
            <div className={styles.block}>
              <p>Наставник:</p>
              <div className={clsx(styles.userRow, styles.skeleton)}>
                <ImageSkeleton className={styles.image} />
                <TextSkeleton className={styles.name} />
              </div>
            </div>
          )}
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

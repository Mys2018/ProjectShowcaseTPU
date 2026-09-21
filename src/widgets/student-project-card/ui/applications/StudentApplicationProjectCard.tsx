import clsx from 'clsx'
import styles from './StudentApplicationProjectCard.module.css'
import { CancelApplicationButton } from '@/features/cancel-application'
import { PartnerRow } from '@/entities/partner'
import {
  getPublicProjectStatus,
  ProjectCardHorizontal,
  ProjectCardTeam,
  useProjectDetails,
  useProjectTeam
} from '@/entities/project'
import { getSortedTags, TagBadgeList } from '@/entities/tag'
import { useUserById, TeamUserCard, Avatar, getAvatarRoleInfo, useMe, getMemberRoleName } from '@/entities/user'
import { ApplicationStatusBadge, type Application } from '@/entities/application'
import { CompetencyRow, isPseudoRole, useCompetencies } from '@/entities/competency'
import {ClockIcon, ImageSkeleton, mapDateToLocalString, ProjectSkeleton, ROUTES, TextSkeleton} from '@/shared'
import {useNavigate} from "react-router-dom";

interface StudentApplicationProjectCardProps {
  application: Application
  className?: string
}

export function StudentApplicationProjectCard({ application, className }: StudentApplicationProjectCardProps) {
  const { data: project } = useProjectDetails(application.projectId)
  const { data: curator } = useUserById(project?.ownerId, Boolean(project?.ownerId))
  const { data: team = [] } = useProjectTeam(project?.id ?? '', Boolean(project?.id))
  const { data: competencies } = useCompetencies()
  const { data: me } = useMe()
  const navigate = useNavigate()

  const isExtended = application.status === 'pending'

  if (!project) {
    return <ProjectSkeleton className={clsx(styles.card, styles.skeleton, isExtended && styles.big, className)} />
  }

  const roleForApplication = project.roles?.find(r => r.roleId === application.roleID || r.roleTypeId === application.roleID)
  const targetCompetency = competencies?.find(c => c.id === application.roleID || (roleForApplication && c.id === roleForApplication.roleTypeId))
  const studentUserId = application.studentID || (me?.id ? Number(me.id) : undefined)
  const placedRole = studentUserId
    ? project.roles?.find(r => r.placeUserIds?.includes(studentUserId))?.meta?.name
    : undefined
  const memberRole = studentUserId ? getMemberRoleName(studentUserId, project) : undefined
  const validMemberRole = memberRole && !isPseudoRole(memberRole) ? memberRole : undefined

  const rawRoleName =
    roleForApplication?.meta?.name ||
    targetCompetency?.name ||
    placedRole ||
    validMemberRole ||
    ''

  const roleName = isPseudoRole(rawRoleName) ? '' : rawRoleName

  const isRecruiting = project.status === 'Recruiting' && getPublicProjectStatus(project) === 'Recruiting'

  const statusBadge =
    isRecruiting && application.status === 'pending' ? (
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
      onClick={() => {
        navigate(`${ROUTES.PROJECTS.BASE}/${project.id}`)
      }}
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
            {roleName && (
              <div className={styles.block}>
                <p>Компетенция:</p>
                <CompetencyRow
                  role={roleName}
                  className={styles.competencyText}
                />
              </div>
            )}
          </div>
          {curator ? (
            <div className={styles.block}>
              <p>Наставник:</p>
              <TeamUserCard
                userId={curator.id}
                avatar={
                  <Avatar
                    userId={curator.id}
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

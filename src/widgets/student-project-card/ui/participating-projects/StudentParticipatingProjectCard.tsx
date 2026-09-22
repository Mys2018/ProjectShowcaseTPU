import clsx from 'clsx'
import { Link, useNavigate } from 'react-router-dom'
import styles from './StudentParticipatingProjectCard.module.css'
import { CompetencyRow, isPseudoRole, useCompetencies } from '@/entities/competency'
import { PartnerRow } from '@/entities/partner'
import {
  getProjectDates,
  getPublicProjectStatus,
  getScoreWord,
  getStudentProjectHours,
  ProjectCardHorizontal,
  ProjectCardTeam,
  ProjectPublicStatusLabel,
  useProjectTeam,
  useProjectTimesheetSummary,
  type ProjectCardData
} from '@/entities/project'
import { Avatar, getAvatarRoleInfo, getMemberRoleName, TeamUserCard, useMe, useUserById } from '@/entities/user'
import { getSortedTags, TagBadgeList } from '@/entities/tag'
import { buildRoute, CalendarIcon, ChevronRightIcon, mapDateToLocalString, ROUTES } from '@/shared'
import { useModalStore } from '@/shared/model'

interface StudentParticipatingProjectCardProps {
  project: ProjectCardData
  competencyId?: string
  className?: string
}

export function StudentParticipatingProjectCard({ project, competencyId, className }: StudentParticipatingProjectCardProps) {
  const { data: curator } = useUserById(project?.ownerId)
  const { data: team = [] } = useProjectTeam(project?.id, Boolean(project?.id))
  const { data: timesheetSummary } = useProjectTimesheetSummary(project?.id, Boolean(project?.id))
  const { data: competencies } = useCompetencies()
  const { data: me } = useMe()
  const navigate = useNavigate()
  const openModal = useModalStore(state => state.openModal)

  if (!project) return null

  const myUserId = me?.id ? Number(me.id) : undefined
  const placedRole = myUserId
    ? project.roles?.find(r => r.placeUserIds?.includes(myUserId))?.meta?.name
    : undefined
  const roleForCompetency = project.roles?.find(r => r.roleTypeId === competencyId || r.roleId === competencyId)
  const targetCompetency = competencies?.find(c => c.id === competencyId || (roleForCompetency && c.id === roleForCompetency.roleTypeId))
  const memberRole = myUserId ? getMemberRoleName(myUserId, project) : undefined
  const validMemberRole = memberRole && !isPseudoRole(memberRole) ? memberRole : undefined

  const rawRoleName =
    placedRole ||
    targetCompetency?.name ||
    roleForCompetency?.meta?.name ||
    validMemberRole ||
    project.roles?.[0]?.meta?.name ||
    ''

  const roleName = isPseudoRole(rawRoleName) ? '' : rawRoleName

  const { opening: openingDate, closure: closureDate } = getProjectDates(project.checkpoints.checkpoints)

  const isClosed = project.status === 'Completed' || project.status === 'NotImplemented' || project.status === 'Archived'

  const studentHours = getStudentProjectHours(timesheetSummary, me?.id)
  // Часы идут по спринтам — таблица есть только у проектов в работе и в архиве
  const hasHoursTable = project.status === 'InProgress' || isClosed

  const openHoursTable = (e: React.MouseEvent) => {
    // вся карточка — ссылка на проект, клик по кнопке не должен туда уводить
    e.stopPropagation()
    openModal('MY_PROJECT_HOURS', {
      projectId: project.id,
      title: project.meta.title,
      // компетенция — та же, что в карточке: по месту, которое я занимаю в роли проекта
      competency: { id: '', name: roleName },
      deadline: closureDate
    })
  }

  return (
    <ProjectCardHorizontal
      className={clsx(styles.card, className)}
      project={project}
      onClick={() => {
        navigate(`${ROUTES.PROJECTS.BASE}/${project.id}`)
      }}
      headerSlot={
        <div className={styles.header}>
          <TagBadgeList tags={getSortedTags(project.tags, project.primaryTag)} visibleCount={2} />
          <ProjectPublicStatusLabel status={getPublicProjectStatus(project)} />
        </div>
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
          {curator && (
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
                nameTextStyle="bodySmall"
                nameSubtextStyle="OS-12-350"
                nameStyle="normal"
              />
            </div>
          )}
        </div>
      }
      footerSlot={
        <div className={styles.footer}>
          {isClosed && openingDate && closureDate && (
            <div className={styles.dates}>
              <CalendarIcon />
              <p className={styles.label}>
                {mapDateToLocalString(openingDate, { digitsOnly: true })} – {mapDateToLocalString(closureDate, { digitsOnly: true })}
              </p>
            </div>
          )}
          <div className={styles.summary}>
            <Link className={styles.link} to={buildRoute.project(project.id)}>
              Перейти к проекту <ChevronRightIcon />
            </Link>

            <div className={clsx(styles.results, isClosed && styles.closed)}>
              <p className={styles.points}>
                {isClosed && <span className={styles.preface}>Ваш результат:</span>}
                <span className={styles.score}>
                  <span className={styles.strong}>{studentHours}</span>
                  {getScoreWord(studentHours)}
                </span>
              </p>
              {hasHoursTable && (
                <button type="button" className={styles.sheetButton} onClick={openHoursTable}>
                  Посмотреть таблицу
                </button>
              )}
            </div>
          </div>
        </div>
      }
    />
  )
}

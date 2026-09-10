import clsx from 'clsx'
import { Link } from 'react-router-dom'
import styles from './StudentParticipatingProjectCard.module.css'
import { CompetencyBadge, CompetencyRowSkeleton, useCompetencies } from '@/entities/competency'
import { PartnerRow, PartnerRowSkeleton } from '@/entities/partner'
import { getProjectDates, ProjectCardHorizontal, ProjectPublicStatusLabel, type ProjectCardData } from '@/entities/project'
import { TeamUserCard, useUserById } from '@/entities/user'
import { getSortedTags, TagBadgeList } from '@/entities/tag'
import { CalendarIcon, ChevronRightIcon, ImageSkeleton, mapDateToLocalString, ROUTES, TextSkeleton } from '@/shared'

interface StudentParticipatingProjectCardProps {
  project: ProjectCardData
  competencyId: string
  className?: string
}

export function StudentParticipatingProjectCard({ project, competencyId, className }: StudentParticipatingProjectCardProps) {
  const { data: curator } = useUserById(project.ownerId)
  const { data: competencies } = useCompetencies()

  if (!project) return

  const targetCompetency = competencies?.find(c => c.id === competencyId)
  const { opening: openingDate, closure: closureDate } = getProjectDates(project.checkpoints.checkpoints)
  const closureDateVerbal = closureDate?.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  const isClosed = project.status === 'Completed' || project.status === 'NotImplemented'

  return (
    <ProjectCardHorizontal
      className={clsx(styles.card, className)}
      project={project}
      headerSlot={
        <div className={styles.header}>
          <TagBadgeList tags={getSortedTags(project.tags, project.primaryTag)} visibleCount={2} />
        </div>
      }
      mainSlot={project.partner ? <PartnerRow partner={project.partner} /> : <PartnerRowSkeleton />}
      sideSlot={
        <>
          <div className={styles.side}>
            {/* <div className={styles.team}>
            <p className={styles.label}>Команда:</p>
						<UserGroup users={project.team} />
          </div> */}
            {/* TODO вернуть когда в ответе будет приходить команда */}
            <div className={styles.competency}>
              <p className={styles.label}>Компетенция:</p>
              {targetCompetency ? <CompetencyBadge competency={targetCompetency} /> : <CompetencyRowSkeleton className={styles.skeleton} />}
              {(!isClosed || closureDateVerbal) && (
                <div className={styles.badge}>
                  {isClosed ? (
                    <p className={styles.label}>Завершён {closureDateVerbal} г.</p>
                  ) : (
                    <ProjectPublicStatusLabel status={project.status} />
                  )}
                </div>
              )}
            </div>
          </div>
          <div className={styles.curator}>
            <p className={styles.label}>Наставник:</p>
            <div className={clsx(styles.userRow, !curator && styles.skeleton)}>
              {curator ? (
                <TeamUserCard
                  avatar={curator.profilePicture}
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
        </>
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
            <Link className={styles.link} to={ROUTES.PROJECTS.PROJECT.replace(':id', project.id)}>
              Перейти к проекту <ChevronRightIcon />
            </Link>
            <div className={clsx(styles.results, isClosed && styles.closed)}>
              <p className={styles.label}>
                <span className={styles.preface}>{isClosed && 'Ваш результат'}</span>
                <span className={styles.strong}>36</span> баллов
              </p>
              <button type='button' className={styles.sheetButton}>
                Показать таблицу
              </button>
            </div>
          </div>
        </div>
      }
    />
  )
}

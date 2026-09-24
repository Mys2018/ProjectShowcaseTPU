import { useNavigate } from 'react-router-dom'
import styles from './ApplicationRow.module.css'
import { Avatar, getAvatarRoleInfo, TeamUserCard, useUserById } from '@/entities/user'
import type { Application } from '@/entities/application'
import { buildRoute } from '@/shared/config/routes'
import { SmallRejectButton, SmallAcceptButton, mapDateToLocalString } from '@/shared'

interface ApplicationRowProps {
  application: Application
  /** Статус-запрос этой заявки в полёте — обе кнопки строки блокируются. */
  isPending?: boolean
  onAccept: (applicationId: string) => void
  onReject: (applicationId: string) => void
}

export const ApplicationRow = ({ application, isPending, onAccept, onReject }: ApplicationRowProps) => {
  const navigate = useNavigate()
  const { data: user, isLoading } = useUserById(application.studentID)

  if (isLoading || !user) {
    return (
      <div className={styles.row}>
        <p className={styles.loadingText}>Загрузка...</p>
      </div>
    )
  }

  const handleAvatarClick = () => {
    navigate(buildRoute.profileById(String(application.studentID)))
  }

  const formattedDate = application.createdAt
    ? (() => {
        const d = new Date(application.createdAt)
        return isNaN(d.getTime()) ? '' : mapDateToLocalString(d, { time: true })
      })()
    : ''

  // В подписи строки нужны именно навыки (Docker, Figma…), не названия компетенций (QA).
  // meta.skills = CompetenceDto[] → у каждой competence свой список skillName.
  const skillNames = Array.from(
    new Set(
      (user.meta.skills ?? []).flatMap((competence) =>
        (competence.skills ?? []).map((s) => s.skillName).filter(Boolean)
      )
    )
  )
  // Если у пользователя ещё нет навыков в профиле — fallback на названия компетенций.
  const subtitleLabels =
    skillNames.length > 0
      ? skillNames
      : (user.competencies ?? []).filter(Boolean)

  return (
    <div className={styles.row}>
      <div className={styles.userInfo} onClick={handleAvatarClick}>
        <TeamUserCard
          userId={application.studentID}
          onClick={(e) => {
            e.stopPropagation()
            handleAvatarClick()
          }}
          avatar={
            <Avatar
              userId={application.studentID}
              picture={user.profilePicture}
              fallbackType={getAvatarRoleInfo(user.roles)?.fallback || 'user'}
              size={"48px"}
              strokeColor={"grey"}
            />
          }
          firstName={user.meta.firstName}
          lastName={user.meta.lastName}
          nameTextStyle={'bodyText'}
          nameSubtextStyle={'OS-12-350'}
          nameStyle={'normal'}
          course={user.grade}
          roles={subtitleLabels}
        />
      </div>

      <div className={styles.actions}>
        {formattedDate && <p className={styles.date}>{formattedDate}</p>}
        <div className={styles.buttonRow}>
          <SmallRejectButton
            textButton={'Отклонить'}
            onClick={() => onReject(application.applicationID)}
            disabled={isPending}
          />
          <SmallAcceptButton
            textButton={'Принять'}
            onClick={() => onAccept(application.applicationID)}
            disabled={isPending}
          />
        </div>
      </div>
    </div>
  )
}


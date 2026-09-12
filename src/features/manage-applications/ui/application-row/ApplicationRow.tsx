import { useNavigate } from 'react-router-dom'
import styles from './ApplicationRow.module.css'
import { Avatar, getAvatarRoleInfo, TeamUserCard, useUserById } from '@/entities/user'
import type { Application } from '@/entities/application'
import { buildRoute } from '@/shared/config/routes'
import { SmallRejectButton, SmallAcceptButton, mapDateToLocalString } from '@/shared'

interface ApplicationRowProps {
  application: Application
  onAccept: (applicationId: string) => void
  onReject: (applicationId: string) => void
}

export const ApplicationRow = ({ application, onAccept, onReject }: ApplicationRowProps) => {
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

  return (
    <div className={styles.row}>
      <div className={styles.userInfo} onClick={handleAvatarClick}>
        <TeamUserCard
          avatar={
            <Avatar
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
          roles={user.competencies}
        />
      </div>

      <div className={styles.actions}>
        {formattedDate && <p className={styles.date}>{formattedDate}</p>}
        <div className={styles.buttonRow}>
          <SmallRejectButton
            textButton={'Отклонить'}
            onClick={() => onReject(application.applicationID)}
          />
          <SmallAcceptButton
            textButton={'Принять'}
            onClick={() => onAccept(application.applicationID)}
          />
        </div>
      </div>
    </div>
  )
}


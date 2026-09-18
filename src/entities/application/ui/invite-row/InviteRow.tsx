import { useNavigate } from 'react-router-dom'
import styles from './InviteRow.module.css'
import { Avatar, getAvatarRoleInfo, useUserById } from '@/entities/user'
import { useProjectDetails } from '@/entities/project'
import type { Application } from '@/entities/application/model/types'
import { buildRoute, mapDateToLocalString, SmallAcceptButton, SmallRejectButton } from '@/shared'
import OpenIcon from '@/shared/ui/icons/open.svg?react'

export interface InviteRowProps {
  application: Application
  isPending?: boolean
  onApprove: (applicationId: string) => void
  onReject: (applicationId: string) => void
}

export const InviteRow = ({
  application,
  isPending,
  onApprove,
  onReject,
}: InviteRowProps) => {
  const navigate = useNavigate()

  const projectId = application.projectId || (application as unknown as { projectID?: string }).projectID || ''
  const { data: project } = useProjectDetails(projectId)
  const { data: curator } = useUserById(project?.ownerId, Boolean(project?.ownerId))

  const role = project?.roles?.find(
    (r) => r.roleId === application.roleID || r.roleTypeId === application.roleID
  )
  const competency = role?.meta?.name || 'Участник'
  const projectName = project?.meta?.title || 'Проект'

  const formattedDate = application.createdAt
    ? (() => {
        const d = application.createdAt instanceof Date ? application.createdAt : new Date(application.createdAt)
        return isNaN(d.getTime()) ? '' : mapDateToLocalString(d, { time: true })
      })()
    : ''

  const curatorName = curator
    ? `${curator.meta.firstName} ${curator.meta.lastName ? `${curator.meta.lastName.charAt(0).toUpperCase()}.` : ''}`
    : 'Наставник'

  const handleProfileClick = () => {
    if (curator?.id) {
      navigate(buildRoute.profileById(String(curator.id)))
    }
  }

  const handleProjectClick = () => {
    if (projectId) {
      navigate(buildRoute.project(projectId))
    }
  }

  const renderStatusOrActions = () => {
    const status = application.status?.toLowerCase()
    switch (status) {
      case 'pending':
        return (
          <div className={styles.buttonContainer}>
            <SmallAcceptButton
              onClick={() => onApprove(application.applicationID)}
              textButton="Принять"
              disabled={isPending}
            />
            <SmallRejectButton
              onClick={() => onReject(application.applicationID)}
              textButton="Отклонить"
              disabled={isPending}
            />
          </div>
        )
      case 'approved':
        return <p className={styles.statusApproved}>Приглашение принято</p>
      case 'rejected':
        return <p className={styles.statusRejected}>Приглашение отклонено</p>
      case 'cancelled':
      case 'closed':
      default:
        return <p className={styles.statusClosed}>Приглашение больше недоступно</p>
    }
  }

  return (
    <div className={styles.rowContainer}>
      <div className={styles.left}>
        <Avatar
          picture={curator?.profilePicture}
          fallbackType={curator ? getAvatarRoleInfo(curator.roles)?.fallback || 'user' : 'user'}
          size="48px"
          strokeColor="grad"
          onClick={handleProfileClick}
        />
        <div className={styles.innerRight}>
          <div className={styles.info}>
            <p>
              {curatorName} приглашает Вас на компетенцию <span>{competency}</span>
            </p>
            <p onClick={handleProjectClick}>
              Проект <span>{projectName} <OpenIcon className={styles.openIcon} /></span>
            </p>
          </div>

          {renderStatusOrActions()}
        </div>
      </div>
      <div className={styles.right}>
        {formattedDate && <p className={styles.time}>{formattedDate}</p>}
      </div>
    </div>
  )
}

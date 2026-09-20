import { useState, useEffect, Fragment } from 'react'
import clsx from 'clsx'
import styles from './ApplicationRoleCard.module.css'
import { CompetencyCard } from '@/shared/ui/competency-card/CompetencyCard'
import { SkillTagList, type Skill } from '@/entities/skill'
import { InviteUserButton } from '@/shared/ui/elements/buttons/invite-user-button/InviteUserButton'
import { ApplicationRow } from '../application-row/ApplicationRow'
import type { Application } from '@/entities/application'
import UpIcon from '@/shared/ui/icons/up_arrow.svg?react'
import { useModalStore } from '@/shared/model'
import { useUserById } from '@/entities/user'

interface RoleData {
  roleId: string
  roleName: string
  minPlacesCount: number
  skills: Skill[]
  totalOccurrences?: number
}

interface ApplicationRoleCardProps {
  role: RoleData
  index: number
  occurrenceIndex: number
  totalOccurrences?: number
  applications: Application[]
  /** Заявка, чей статус-запрос в полёте — блокирует кнопки этой строки. */
  pendingApplicationId?: string
  canInvite?: boolean
  projectId?: string
  teamUserIds?: number[]
  onAccept: (applicationId: string) => void
  onReject: (applicationId: string) => void
  onInvite: (roleId: string, roleName: string, user: { id: number; name: string }) => void
  onCancelInvite?: (applicationId: string) => void
}

export const ApplicationRoleCard = ({
  role,
  index,
  occurrenceIndex,
  totalOccurrences,
  applications,
  pendingApplicationId,
  canInvite = false,
  projectId,
  teamUserIds,
  onAccept,
  onReject,
  onInvite,
  onCancelInvite,
}: ApplicationRoleCardProps) => {
  const { openModal } = useModalStore()
  const [isCollapsed, setIsCollapsed] = useState(true)

  // Активное приглашение от наставника для данной роли
  const pendingInvitation = applications.find(
    (a) => a.applicationType === 'Invitation' && a.status === 'pending'
  )

  // Сворачиваем отклики при появлении нового активного приглашения
  useEffect(() => {
    if (pendingInvitation) {
      setIsCollapsed(true)
    }
  }, [pendingInvitation?.applicationID])

  // Данные приглашенного пользователя из API
  const { data: invitedUser } = useUserById(
    pendingInvitation?.studentID,
    Boolean(pendingInvitation?.studentID)
  )

  // Прямые отклики студентов со статусом pending
  const pendingDirectApplications = applications.filter(
    (a) => a.applicationType === 'Application' && a.status === 'pending'
  )

  const handleInviteUser = () => {
    openModal('INVITE_USER', {
      roleName: role.roleName,
      roleId: role.roleId,
      projectId,
      teamUserIds,
      applications,
      onInvite: (user: { id: number; name: string }) => {
        onInvite(role.roleId, role.roleName, user)
      },
      onAcceptApplication: onAccept,
    })
  }

  const handleCancelInvitation = () => {
    if (pendingInvitation) {
      if (onCancelInvite) {
        onCancelInvite(pendingInvitation.applicationID)
      } else {
        onReject(pendingInvitation.applicationID)
      }
    }
  }

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev)
  }

  const isInvitePending =
    Boolean(pendingInvitation) && pendingApplicationId === pendingInvitation?.applicationID

  const invitedUserName = invitedUser
    ? `${invitedUser.meta.firstName} ${invitedUser.meta.lastName}`
    : 'Пользователь'

  const requestContent = (
    <div className={styles.application}>
      {pendingInvitation ? (
        pendingDirectApplications.length === 0 ? (
          // Фото 2: Активное приглашение, откликов пока нет
          <div className={styles.freeBlock}>
            <div className={styles.fullInviteContainer}>
              <p className={styles.fieldText}>
                Откликов пока нет
              </p>

              <div className={styles.invitedInfo}>
                <div className={styles.invitedName}>
                  Приглашен: <span>{invitedUserName}</span>
                </div>
                <button
                  type="button"
                  className={styles.cancelInviteBtn}
                  onClick={handleCancelInvitation}
                  disabled={isInvitePending}
                >
                  Отменить
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Фото 3: Активное приглашение И есть прямые отклики
          <div className={clsx(styles.invitedWithApplicationsContainer, !isCollapsed && styles.invitedWithApplicationsExpanded)}>
            <div className={styles.invitedInfo}>
              <div className={styles.invitedName}>
                Приглашен: <span>{invitedUserName}</span>
              </div>
              <button
                type="button"
                className={styles.cancelInviteBtn}
                onClick={handleCancelInvitation}
                disabled={isInvitePending}
              >
                Отменить
              </button>
            </div>

            <button
              type="button"
              className={styles.blueFeedbackButton}
              onClick={toggleCollapse}
            >
              Откликов: {pendingDirectApplications.length}
            </button>

            {!isCollapsed && (
              <div className={styles.applicationList}>
                {pendingDirectApplications.map((application, appIndex) => (
                  <Fragment key={application.applicationID}>
                    <ApplicationRow
                      application={application}
                      isPending={pendingApplicationId === application.applicationID}
                      onAccept={onAccept}
                      onReject={onReject}
                    />
                    {appIndex < pendingDirectApplications.length - 1 && (
                      <div className={styles.separator} />
                    )}
                  </Fragment>
                ))}
              </div>
            )}
          </div>
        )
      ) : pendingDirectApplications.length > 0 ? (
        // Если активного приглашения нет — показываем входящие отклики от студентов с иконкой приглашения справа вверху
        <div className={styles.applicationsBlock}>
          <div className={styles.applicationsHeader}>
            <p>
              Откликов: {pendingDirectApplications.length}
            </p>
            <div className={styles.headerActions}>
              {canInvite && (
                <InviteUserButton iconOnly onClick={handleInviteUser} />
              )}
              <button
                type="button"
                className={styles.toggleButton}
                onClick={toggleCollapse}
                aria-label={isCollapsed ? 'Развернуть отклики' : 'Свернуть отклики'}
              >
                <UpIcon className={clsx(styles.toggleIcon, isCollapsed && styles.iconDown)} />
              </button>
            </div>
          </div>

          <div className={styles.applicationList}>
            {pendingDirectApplications.map((application, appIndex) => (
              <Fragment key={application.applicationID}>
                <ApplicationRow
                  application={application}
                  isPending={pendingApplicationId === application.applicationID}
                  onAccept={onAccept}
                  onReject={onReject}
                />
                {appIndex < pendingDirectApplications.length - 1 && (
                  <div className={styles.separator} />
                )}
              </Fragment>
            ))}
          </div>
        </div>
      ) : (
        // Если откликов нет и приглашений нет — кнопка пригласить (Фото 1)
        <div className={styles.freeBlock}>
          <p className={styles.fieldText}>Откликов пока нет</p>
          {canInvite ? (
            <div className={styles.inviteContainer}>
              <InviteUserButton onClick={handleInviteUser} />
            </div>
          ) : (
            <p className={styles.noRecruiting}>
              Проект еще не выпущен
            </p>
          )}
        </div>
      )}
    </div>
  )

  return (
    <CompetencyCard
      index={index}
      name={role.roleName}
      isRequired={role.minPlacesCount > 0}
      occurrenceIndex={occurrenceIndex}
      totalOccurrences={totalOccurrences ?? role.totalOccurrences}
      skillsContent={
        <SkillTagList
          skills={role.skills}
          maxVisible={3}
        />
      }
      requestContent={requestContent}
      isCollapsed={isCollapsed}
      hasApplications={pendingDirectApplications.length > 0}
    />
  )
}

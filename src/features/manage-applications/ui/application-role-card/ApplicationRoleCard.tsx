import { useState, Fragment } from 'react'
import clsx from 'clsx'
import styles from './ApplicationRoleCard.module.css'
import { CompetencyCard } from '@/shared/ui/competency-card/CompetencyCard'
import { SkillTagList, type Skill } from '@/entities/skill'
import { InviteUserButton } from '@/shared/ui/elements/buttons/invite-user-button/InviteUserButton'
import { ApplicationRow } from '../application-row/ApplicationRow'
import type { Application } from '@/entities/application'
import UpIcon from '@/shared/ui/icons/up_arrow.svg?react'
import { useModalStore } from '@/shared/model'

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
  onAccept: (applicationId: string) => void
  onReject: (applicationId: string) => void
  onInvite: (roleId: string, roleName: string, user: { id: number; name: string }) => void
}

export const ApplicationRoleCard = ({
  role,
  index,
  occurrenceIndex,
  totalOccurrences,
  applications,
  pendingApplicationId,
  onAccept,
  onReject,
  onInvite,
}: ApplicationRoleCardProps) => {
  const { openModal } = useModalStore()
  const [invitedUser, setInvitedUser] = useState<{ id: number; name: string } | null>(null)
  const [isCollapsed, setIsCollapsed] = useState(true)

  const pendingApplications = applications.filter((a) => a.status === 'pending')

  const handleInviteUser = () => {
    openModal('INVITE_USER', {
      roleName: role.roleName,
      onInvite: (user: { id: number; name: string }) => {
        setInvitedUser(user)
        onInvite(role.roleId, role.roleName, user)
      },
    })
  }

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev)
  }

  const requestContent = (
    <div className={clsx(styles.application, isCollapsed && styles.isCollapsedList)}>
      {pendingApplications.length > 0 ? (
        <div className={styles.applicationsBlock}>
          <div className={styles.applicationsHeader}>
            <p>
              Откликов: {pendingApplications.length}
            </p>
            <button
              type="button"
              className={styles.toggleButton}
              onClick={toggleCollapse}
              aria-label={isCollapsed ? 'Развернуть отклики' : 'Свернуть отклики'}
            >
              <UpIcon className={clsx(styles.toggleIcon, isCollapsed && styles.iconDown)} />
            </button>
          </div>

          <div className={clsx(styles.applicationList, isCollapsed && styles.collapsedList)}>
            {pendingApplications.map((application, appIndex) => (
              <Fragment key={application.applicationID}>
                <ApplicationRow
                  application={application}
                  isPending={pendingApplicationId === application.applicationID}
                  onAccept={onAccept}
                  onReject={onReject}
                />
                {appIndex < pendingApplications.length - 1 && (
                  <div className={styles.separator} />
                )}
              </Fragment>
            ))}
          </div>

        </div>
      ) : (
        <div className={styles.freeBlock}>
          <p className={styles.fieldText}>Компетенция свободна</p>
          {!invitedUser && (
            <InviteUserButton onClick={handleInviteUser} />
          )}
          {invitedUser && (
            <div className={styles.invitedInfo}>
              <p className={styles.invitedName}>
                <div>
                  Приглашен:
                  <span>{invitedUser.name}</span>
                </div>
              </p>
              <button
                type="button"
                className={styles.cancelInviteBtn}
                onClick={() => setInvitedUser(null)}
              >
                Отменить
              </button>
            </div>
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
    />
  )
}

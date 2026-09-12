import { useState } from 'react'
import styles from './ApplicationRoleCard.module.css'
import { CompetencyCard } from '@/shared/ui/competency-card/CompetencyCard'
import { SkillTagList } from '@/shared/ui/skill-tag-list/SkillTagList'
import { InviteUserButton } from '@/shared/ui/elements/buttons/invite-user-button/InviteUserButton'
import { ApplicationRow } from '../application-row/ApplicationRow'
import type { Application } from '@/entities/application'
import { useModalStore } from '@/shared/model'

interface RoleData {
  roleId: string
  roleName: string
  minPlacesCount: number
  skills: { id: string; name: string }[]
}

interface ApplicationRoleCardProps {
  role: RoleData
  index: number
  occurrenceIndex: number
  applications: Application[]
  onAccept: (applicationId: string) => void
  onReject: (applicationId: string) => void
  onInvite: (roleId: string, roleName: string, user: { id: number; name: string }) => void
}

export const ApplicationRoleCard = ({
  role,
  index,
  occurrenceIndex,
  applications,
  onAccept,
  onReject,
  onInvite,
}: ApplicationRoleCardProps) => {
  const { openModal } = useModalStore()
  const [invitedUser, setInvitedUser] = useState<{ id: number; name: string } | null>(null)

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

  const requestContent = (
    <>
      {pendingApplications.length > 0 ? (
        <div className={styles.applicationsBlock}>
          <p className={styles.applicationsHeader}>
            Откликов: {pendingApplications.length}
          </p>
          {pendingApplications.map((application) => (
            <ApplicationRow
              key={application.applicationID}
              application={application}
              onAccept={onAccept}
              onReject={onReject}
            />
          ))}
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
    </>
  )

  return (
    <CompetencyCard
      index={index}
      name={role.roleName}
      isRequired={role.minPlacesCount > 0}
      occurrenceIndex={occurrenceIndex}
      skillsContent={
        <SkillTagList
          skills={role.skills}
          maxVisible={3}
        />
      }
      requestContent={requestContent}
    />
  )
}

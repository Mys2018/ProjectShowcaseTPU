import { useMemo, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import styles from './ApplicationsPanel.module.css'
import { ApplicationRoleCard } from '../application-role-card/ApplicationRoleCard'
import {
  useApplications,
  updateApplicationStatus,
  createApplication,
  applicationKeys,
  type ApplicationStatus,
  type Application,
} from '@/entities/application'
import type { ProjectCardData } from '@/entities/project'

interface ApplicationsPanelProps {
  project: ProjectCardData
}

export const ApplicationsPanel = ({ project }: ApplicationsPanelProps) => {
  const queryClient = useQueryClient()

  const { data: applicationsData, isLoading } = useApplications({
    mode: 'AsOwner',
    projectId: project.id,
    offset: 0,
    limit: 100,
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ applicationId, status }: { applicationId: string; status: ApplicationStatus }) =>
      updateApplicationStatus(applicationId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() })
    },
  })

  const createInvitationMutation = useMutation({
    mutationFn: ({ roleId, studentId }: { roleId: string; studentId: number }) =>
      createApplication({ roleId, type: 'Invitation', studentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() })
    },
  })

  const handleAccept = useCallback(
    (applicationId: string) => {
      updateStatusMutation.mutate({ applicationId, status: 'approved' })
    },
    [updateStatusMutation]
  )

  const handleReject = useCallback(
    (applicationId: string) => {
      updateStatusMutation.mutate({ applicationId, status: 'rejected' })
    },
    [updateStatusMutation]
  )

  const handleInvite = useCallback(
    (roleId: string, _roleName: string, user: { id: number; name: string }) => {
      createInvitationMutation.mutate({ roleId, studentId: user.id })
    },
    [createInvitationMutation]
  )

  // Map applications to roles by roleID
  const applicationsByRole = useMemo(() => {
    const map = new Map<string, Application[]>()
    if (!applicationsData?.applications) return map
    for (const app of applicationsData.applications) {
      const list = map.get(app.roleID) || []
      list.push(app)
      map.set(app.roleID, list)
    }
    return map
  }, [applicationsData])

  // Compute occurrence indices for duplicate role types
  const rolesWithOccurrence = useMemo(() => {
    const countMap = new Map<string, number>()
    return project.roles.map((role) => {
      const roleTypeKey = role.meta.name
      const currentCount = (countMap.get(roleTypeKey) || 0) + 1
      countMap.set(roleTypeKey, currentCount)
      return { ...role, occurrenceIndex: currentCount }
    })
  }, [project.roles])

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <p>Загрузка откликов...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainInfo}>
        <h3>Компетенции проекта</h3>
        <p>Открытые компетенции с входящими заявками от участников</p>
      </div>

      {rolesWithOccurrence.length === 0 ? (
        <div className={styles.emptyState}>
          <p>В проекте нет открытых компетенций</p>
        </div>
      ) : (
        <div className={styles.competencyList}>
          {rolesWithOccurrence.map((role, index) => (
            <ApplicationRoleCard
              key={role.roleId}
              index={index}
              role={{
                roleId: role.roleId,
                roleName: role.meta.name,
                minPlacesCount: role.minPlacesCount,
                skills: role.skills.map((s) => ({
                  id: s.skillId,
                  name: s.skillName,
                })),
              }}
              occurrenceIndex={role.occurrenceIndex}
              applications={applicationsByRole.get(role.roleId) || []}
              onAccept={handleAccept}
              onReject={handleReject}
              onInvite={handleInvite}
            />
          ))}
        </div>
      )}
    </div>
  )
}

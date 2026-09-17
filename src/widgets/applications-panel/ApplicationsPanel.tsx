import { useMemo, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import styles from './ApplicationsPanel.module.css'
import { ApplicationRoleCard } from '../../features/manage-applications/ui/application-role-card/ApplicationRoleCard.tsx'
import {
  useApplications,
  updateApplicationStatus,
  createApplication,
  applicationKeys,
  type ApplicationStatus,
  type Application,
} from '@/entities/application'
import {projectQueryKeys, type ProjectCardData, useProjectTeam} from '@/entities/project'
import { TeamMemberCard, type UserCard } from "@/entities/user";

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

  const {data: team} = useProjectTeam(project.id)

  // Одобрение/отклонение меняет состав команды и занятые места, приглашение —
  // тоже: списки participating/applied и деталь проекта (team, roles) обязаны
  // рефетчиться вместе со списком заявок, иначе панель действия и ростер
  // показывают устаревшее состояние до конца сессии.
  const invalidateApplicationScope = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: applicationKeys.lists() })
    queryClient.invalidateQueries({ queryKey: projectQueryKeys.participatingList() })
    queryClient.invalidateQueries({ queryKey: projectQueryKeys.appliedList() })
    queryClient.invalidateQueries({ queryKey: projectQueryKeys.details(project.id) })
  }, [queryClient, project.id])

  const updateStatusMutation = useMutation({
    mutationFn: ({ applicationId, status }: { applicationId: string; status: ApplicationStatus }) =>
      updateApplicationStatus(applicationId, status),
    onSuccess: invalidateApplicationScope,
  })

  const createInvitationMutation = useMutation({
    mutationFn: ({ roleId, studentId }: { roleId: string; studentId: number }) =>
      createApplication({ roleId, type: 'Invitation', studentId }),
    onSuccess: invalidateApplicationScope,
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

  // Ид заявки, чей статус-запрос сейчас в полёте: кнопки этой строки блокируем,
  // чтобы второй клик не отправил конфликтующий статус (финал решает порядок
  // прихода пакетов на сервер).
  const pendingApplicationId =
    updateStatusMutation.isPending ? updateStatusMutation.variables?.applicationId : undefined

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

  // Compute occurrence indices and total count for duplicate role types
  const rolesWithOccurrence = useMemo(() => {
    const countMap = new Map<string, number>()
    const totalMap = new Map<string, number>()
    for (const r of project.roles) {
      const key = r.meta.name
      totalMap.set(key, (totalMap.get(key) || 0) + 1)
    }
    return project.roles.map((role) => {
      const roleTypeKey = role.meta.name
      const currentCount = (countMap.get(roleTypeKey) || 0) + 1
      countMap.set(roleTypeKey, currentCount)
      const totalCount = totalMap.get(roleTypeKey) || 1
      return {
        ...role,
        occurrenceIndex: currentCount,
        totalOccurrences: totalCount,
      }
    })
  }, [project.roles])

  // Открытые компетенции (где ещё нет человека на роли)
  const openRoles = useMemo(() => {
    return rolesWithOccurrence.filter((role) => {
      const occupiedCount = role.placeUserIds?.length ?? role.places ?? 0
      return occupiedCount === 0
    })
  }, [rolesWithOccurrence])

  // Занятые роли (где уже есть человек на роли)
  const occupiedRoleItems = useMemo(() => {
    const items: {
      role: typeof rolesWithOccurrence[number]
      user: UserCard
    }[] = []

    for (const role of rolesWithOccurrence) {
      const userIds = role.placeUserIds || []
      if (userIds.length > 0) {
        for (const uid of userIds) {
          const user = team?.find((u) => u.userId === uid)
          items.push({
            role,
            user: user || {
              userId: uid,
              email: '',
              meta: { firstName: '', lastName: '' },
            },
          })
        }
      } else if ((role.places ?? 0) > 0) {
        const user = team?.find((u) => u.roles?.includes(role.meta.name))
        if (user) {
          items.push({ role, user })
        }
      }
    }

    return items
  }, [rolesWithOccurrence, team])

  // Участники команды, не привязанные к конкретной роли (например, куратор проекта)
  const unassignedTeamMembers = useMemo(() => {
    if (!team) return []
    return team.filter((u) => !project.roles.some((r) => r.placeUserIds?.includes(u.userId)))
  }, [team, project.roles])

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
      <div className={styles.bigBlock}>
        <div className={styles.mainInfo}>
          <h3>Компетенции проекта</h3>
          <p>Открытые компетенции с входящими заявками от участников</p>
        </div>

        {openRoles.length === 0 ? (
          <div className={styles.emptyState}>
            <p>В проекте нет открытых компетенций</p>
          </div>
        ) : (
          <div className={styles.competencyList}>
            {openRoles.map((role, index) => (
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
                  totalOccurrences: role.totalOccurrences,
                }}
                occurrenceIndex={role.occurrenceIndex}
                totalOccurrences={role.totalOccurrences}
                applications={applicationsByRole.get(role.roleId) || []}
                pendingApplicationId={pendingApplicationId}
                canInvite={project.status === 'Recruiting'}
                onAccept={handleAccept}
                onReject={handleReject}
                onInvite={handleInvite}
              />
            ))}
          </div>
        )}
      </div>
      <div className={styles.bigBlock}>
        <div className={styles.mainInfo}>
          <h3>Команда проекта</h3>
          <p>Утверждённый состав участников, реализующих проект</p>
        </div>
        <div className={styles.competencyList}>
          {occupiedRoleItems.length > 0 || unassignedTeamMembers.length > 0 ? (
            <>
              {occupiedRoleItems.map((item, index) => {
                const role = item.role
                const memberSkills = role.skills.map((s) => ({
                  id: s.skillId,
                  name: s.skillName,
                }))
                const memberCompetency = {
                  id: role.roleId || role.roleTypeId || '',
                  name: role.meta.name,
                }

                return (
                  <TeamMemberCard
                    key={`${role.roleId}-${item.user.userId}`}
                    user={item.user}
                    skills={memberSkills}
                    competency={memberCompetency}
                    index={index}
                    name={role.meta.name}
                    isRequired={role.minPlacesCount > 0}
                    occurrenceIndex={role.occurrenceIndex}
                    totalOccurrences={role.totalOccurrences}
                  />
                )
              })}
              {unassignedTeamMembers.map((user, idx) => (
                <TeamMemberCard
                  key={user.userId}
                  user={user}
                  skills={[]}
                  competency={
                    user.userId === project.ownerId
                      ? { id: 'curator', name: 'Куратор проекта' }
                      : undefined
                  }
                  index={occupiedRoleItems.length + idx}
                  name={user.userId === project.ownerId ? 'Куратор проекта' : 'Участник'}
                />
              ))}
            </>
          ) : (
            <div className={styles.emptyState}>
              <p>Команда пока формируется</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

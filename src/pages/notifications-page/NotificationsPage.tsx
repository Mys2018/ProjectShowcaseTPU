import { useCallback, Fragment } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import styles from './NotificationsPage.module.css'
import {
  type ApplicationStatus,
  useApplications,
  updateApplicationStatus,
  applicationKeys,
} from '@/entities/application'
import { projectQueryKeys } from '@/entities/project'
import { InviteRow } from '@/entities/application/ui'
import { ROUTES } from '@/shared'
import { BackLink } from '@/shared/ui/back-link'

export const NotificationsPage = () => {
  const queryClient = useQueryClient()

  const { data: invites } = useApplications({
    mode: 'AsStudent',
    type: 'Invitation',
    offset: 0,
    limit: 100,
  })

  const invalidateScope = useCallback(
    (projectId?: string) => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() })
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.participatingList() })
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.appliedList() })
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: projectQueryKeys.details(projectId) })
        queryClient.invalidateQueries({ queryKey: projectQueryKeys.team(projectId) })
      } else {
        queryClient.invalidateQueries({ queryKey: projectQueryKeys.all })
      }
    },
    [queryClient]
  )

  const updateStatusMutation = useMutation({
    mutationFn: ({
      applicationId,
      status,
    }: {
      applicationId: string
      status: ApplicationStatus
      projectId?: string
    }) => updateApplicationStatus(applicationId, status),
    onSuccess: (_, variables) => {
      invalidateScope(variables.projectId)
    },
  })

  const handleApprove = useCallback(
    (applicationId: string, projectId?: string) => {
      updateStatusMutation.mutate({ applicationId, status: 'approved', projectId })
    },
    [updateStatusMutation]
  )

  const handleReject = useCallback(
    (applicationId: string, projectId?: string) => {
      updateStatusMutation.mutate({ applicationId, status: 'rejected', projectId })
    },
    [updateStatusMutation]
  )

  const applications = invites?.applications ?? []
  const pendingApplicationId = updateStatusMutation.isPending
    ? updateStatusMutation.variables?.applicationId
    : undefined

  return (
    <div className={styles.wrapper}>
      <main className={styles.mainContent}>
        <BackLink fallback={ROUTES.MAIN} className={styles.headerLeft} />

        <section className={styles.pageTitle}>
          <h2>Уведомления</h2>
        </section>

        <section className={styles.body}>
          <h3>Приглашения в проект</h3>
          {
            invites && invites.applications.length > 0 ? <div className={styles.inviteList}>
              {
                applications.length > 0 && (
                  applications.map((application, index) => (
                    <Fragment key={application.applicationID}>
                      <InviteRow
                        application={application}
                        isPending={pendingApplicationId === application.applicationID}
                        onApprove={(id) => handleApprove(id, application.projectId)}
                        onReject={(id) => handleReject(id, application.projectId)}
                      />
                      {index < applications.length - 1 && (
                        <div className={styles.horizontalSeparator} />
                      )}
                    </Fragment>
                  ))
                )
              }
            </div> : <div className={styles.emptyMain}>
              <p>Еще нет приглашений</p>
            </div>
          }
        </section>
      </main>
    </div>
  )
}

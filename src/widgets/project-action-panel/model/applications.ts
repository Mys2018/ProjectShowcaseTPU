import { useMutation, useQueryClient } from '@tanstack/react-query'
import { applicationApi, applicationKeys, type ProjectRoleApplication } from '@/entities/application'

/** Активной считаем заявку, которую ещё рассматривают или уже одобрили. */
export const isActiveApplication = (a: ProjectRoleApplication) =>
  a.status === 'Pending' || a.status === 'Approved'

/** Параметры запроса «мои заявки по этому проекту». */
export const myApplicationsParams = (projectId: string) =>
  ({ mode: 'AsStudent', projectId, offset: 0, limit: 100 }) as const

/**
 * Студент снимает свою заявку. Closed — «отозвана» в терминах бэкенда.
 * Список перезапрашивается, поэтому панель обновится сама.
 */
export const useCancelApplication = (projectId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (applicationId: string) => applicationApi.updateApplicationStatus(applicationId, 'Closed'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: applicationKeys.list(myApplicationsParams(projectId)) })
  })
}

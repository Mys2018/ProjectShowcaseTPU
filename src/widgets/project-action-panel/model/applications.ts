import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateApplicationStatus, applicationKeys, type Application } from '@/entities/application'
import { projectQueryKeys } from '@/entities/project'

/** Активной считаем заявку, которую ещё рассматривают или уже одобрили. */
export const isActiveApplication = (a: Application) => a.status === 'pending' || a.status === 'approved'

/** Параметры запроса «мои заявки по этому проекту». */
export const myApplicationsParams = (projectId: string) => ({ mode: 'AsStudent', projectId, offset: 0, limit: 100 }) as const

/**
 * Студент снимает свою заявку. Cancelled — «отозвана» в терминах бэкенда.
 * Инвалидируем префикс списков заявок (страница «Мои отклики» использует
 * другой набор параметров — точный ключ её бы не задел) и списки
 * participating/applied, из которых панель выводит свои состояния.
 */
export const useCancelApplication = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (applicationId: string) => updateApplicationStatus(applicationId, 'cancelled'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() })
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.participatingList() })
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.appliedList() })
    }
  })
}

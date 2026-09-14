import { useMutation, useQueryClient } from '@tanstack/react-query'
import { applicationKeys, updateApplicationStatus } from '@/entities/application'
import { projectQueryKeys } from '@/entities/project'

export const useCancelApplication = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (applicationId: string) => updateApplicationStatus(applicationId, 'cancelled'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() })
      // Панель действия выводит состояния из participating/applied списков —
      // отмена заявки должна их обновить.
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.participatingList() })
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.appliedList() })
    }
  })
}

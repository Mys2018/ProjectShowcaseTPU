import { useMutation, useQueryClient } from '@tanstack/react-query'
import { applicationKeys, updateApplicationStatus } from '@/entities/application'

export const useCancelApplication = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (applicationId: string) => updateApplicationStatus(applicationId, 'closed'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() })
    }
  })
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { projectApi, projectQueryKeys } from '@/entities/project'

export const useApproveProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => projectApi.setProjectModerationReview(id, { verdict: 'Recruiting' }),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.curatedList(), exact: false })
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.list(), exact: false })
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.managedList(), exact: false })
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.review(id) })
    }
  })
}

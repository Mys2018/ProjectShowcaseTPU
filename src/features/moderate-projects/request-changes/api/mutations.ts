import { useMutation, useQueryClient } from '@tanstack/react-query'
import { projectApi, projectQueryKeys } from '@/entities/project'

export const useRequestChangesOnProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { id: string; comment?: string }) =>
      projectApi.setProjectModerationReview(payload.id, { verdict: 'NeedsRework', comment: payload.comment }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.list(), exact: false })
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.curatedList(), exact: false })
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.managedList(), exact: false })
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.review(id) })
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.details(id) })
    }
  })
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { projectApi } from './requests'
import { projectKeys } from './queryKeys'

export const useUpdateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, payload }: { projectId: string; payload: Record<string, unknown> }) =>
      projectApi.updateProject(projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all })
    }
  })
}
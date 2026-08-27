import { useMutation, useQueryClient } from '@tanstack/react-query'
import { projectApi, projectQueryKeys, type GetProjectsResponse, type ProjectCardData } from '@/entities/project'

const useToggleLikeMutation = (mutationFn: (id: string) => Promise<void>, liked: boolean) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onMutate: async id => {
      await queryClient.cancelQueries({ queryKey: projectQueryKeys.details(id) })
      await queryClient.cancelQueries({ queryKey: projectQueryKeys.lists() })

      const prevDetail = queryClient.getQueryData<ProjectCardData>(projectQueryKeys.details(id))
      const prevLists = queryClient.getQueriesData<GetProjectsResponse>({ queryKey: projectQueryKeys.lists() })

      queryClient.setQueryData(projectQueryKeys.details(id), (old: ProjectCardData | undefined) => (old ? { ...old, liked } : old))
      queryClient.setQueriesData({ queryKey: projectQueryKeys.lists() }, (old: GetProjectsResponse | undefined) =>
        old ? { ...old, projects: old.projects.map(p => (p.id === id ? { ...p, liked } : p)) } : old
      )

      return { prevDetail, prevLists }
    },
    onError: (_err, id, context) => {
      if (context?.prevDetail) {
        queryClient.setQueryData(projectQueryKeys.details(id), context.prevDetail)
      }
      context?.prevLists?.forEach(l => queryClient.setQueryData(...l))
    },
    onSettled: (_data, _err, id) => {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.details(id) })
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.lists() })
    }
  })
}

export const useLikeProject = () => useToggleLikeMutation(id => projectApi.likeProject(id), true)
export const useUnlikeProject = () => useToggleLikeMutation(id => projectApi.unlikeProject(id), false)

export const useToggleLikeProject = (liked: boolean) => {
  const like = useLikeProject()
  const unlike = useUnlikeProject()
  return liked ? unlike : like
}

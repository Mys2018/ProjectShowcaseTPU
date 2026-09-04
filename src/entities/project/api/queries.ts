import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { projectApi } from './requests'
import type { GetProjectsQueryParams, CreateProjectDto, GetLikedProjectsParams } from '../model/types'
import { projectKeys } from './queryKeys'

export const useProjects = (params?: GetProjectsQueryParams, enabled?: boolean) => {
  return useQuery({
    queryKey: projectKeys.list(params),
    queryFn: () => projectApi.getProjects(params),
    enabled: enabled
  })
}

export const useProjectDetails = (id: string) => {
  return useQuery({
    queryKey: projectKeys.details(id),
    queryFn: () => projectApi.getProjectById(id),
    enabled: !!id
  })
}

export const useCreateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (newProject: CreateProjectDto) => projectApi.createProject(newProject),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.list() })
    }
  })
}

export const useProjectDraft = () => {
  return useQuery({
    queryKey: projectKeys.draft(),
    queryFn: () => projectApi.getDraft(),
    retry: false
  })
}

export const useSaveDraft = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: unknown) => projectApi.saveDraft(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.draft() })
    }
  })
}

export const useDeleteDraft = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => projectApi.deleteDraft(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.draft() })
    }
  })
}

export const useLikedProjects = (params?: GetLikedProjectsParams, enabled?: boolean) => {
  return useQuery({
    queryKey: projectKeys.likedList(params),
    queryFn: () => projectApi.getLikedProjects(params),
    enabled: enabled
  })
}

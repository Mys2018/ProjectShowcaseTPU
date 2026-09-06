import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { projectApi } from './requests'
import type {
  GetProjectsQueryParams,
  CreateProjectDto,
  GetLikedProjectsParams,
  GetManagedProjectsParams,
  GetParticipatingProjectsParams,
  GetAppliedProjectsParams,
} from '../model/types'
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
    mutationFn: (data: Record<string, unknown>) => projectApi.saveDraft(data),
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

export const useManagedProjects = (params?: GetManagedProjectsParams, enabled?: boolean) => {
  return useQuery({
    queryKey: projectKeys.managedList(params),
    queryFn: () => projectApi.getManagedProjects(params),
    enabled: enabled
  })
}

export const useCuratedProjects = (params?: GetManagedProjectsParams, enabled?: boolean) => {
  return useQuery({
    queryKey: projectKeys.curatedList(params),
    queryFn: () => projectApi.getCuratedProjects(params),
    enabled: enabled
  })
}

export const useParticipatingProjects = (params?: GetParticipatingProjectsParams, enabled?: boolean) => {
  return useQuery({
    queryKey: projectKeys.participatingList(params),
    queryFn: () => projectApi.getParticipatingProjects(params),
    enabled: enabled
  })
}

export const useAppliedProjects = (params?: GetAppliedProjectsParams, enabled?: boolean) => {
  return useQuery({
    queryKey: projectKeys.appliedList(params),
    queryFn: () => projectApi.getAppliedProjects(params),
    enabled: enabled
  })
}

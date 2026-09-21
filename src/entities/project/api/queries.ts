import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import { projectApi } from './requests'
import type {
  GetProjectsQueryParams,
  CreateProjectDto,
  GetLikedProjectsParams,
  GetManagedProjectsParams,
  GetParticipatingProjectsParams,
  GetAppliedProjectsParams,
  SprintHoursBatch,
  ProjectStatus,
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

export const useProjectTeam = (projectId: string, enabled?: boolean) => {
  return useQuery({
    queryKey: projectKeys.team(projectId),
    queryFn: () => projectApi.getProjectTeam(projectId),
    enabled: enabled ?? !!projectId
  })
}

export const useProjectSprints = (projectId: string, enabled?: boolean) => {
  return useQuery({
    queryKey: projectKeys.sprints(projectId),
    queryFn: () => projectApi.getProjectSprints(projectId),
    enabled: enabled !== undefined ? (enabled && !!projectId) : !!projectId
  })
}

/** Матрица часов отдаётся по одному спринту — грузим нужные спринты параллельно. */
export const useSprintsGradingStatus = (projectId: string, sprintIds: string[], enabled?: boolean) => {
  return useQueries({
    queries: sprintIds.map(sprintId => ({
      queryKey: projectKeys.sprintGrading(projectId, sprintId),
      queryFn: () => projectApi.getSprintGradingStatus(projectId, sprintId),
      enabled: enabled !== undefined ? (enabled && !!projectId && !!sprintId) : (!!projectId && !!sprintId)
    })),
    combine: results => ({
      data: results.flatMap(r => (r.data ? [r.data] : [])),
      isLoading: results.some(r => r.isLoading),
      isError: results.some(r => r.isError)
    })
  })
}


/** Часы шлются по одному спринту — изменения из разных спринтов отправляем параллельно. */
export const useSubmitSprintHours = (projectId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (batches: SprintHoursBatch[]) =>
      Promise.all(batches.map(batch => projectApi.submitSprintHours(projectId, batch))),
    // префикс sprints накрывает и grading-status всех спринтов проекта
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.sprints(projectId) })
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

export const useProjectReview = (projectId: string, enabled?: boolean) => {
  return useQuery({
    queryKey: projectKeys.review(projectId),
    queryFn: () => projectApi.getProjectModerationReview(projectId),
    enabled: !!projectId && enabled
  })
}

export const useProjectTimesheetSummary = (projectId?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: projectKeys.timesheetSummary(projectId ?? ''),
    queryFn: () => projectApi.getProjectTimesheetSummary(projectId!),
    enabled: Boolean(projectId) && enabled
  })
}

export const useRemoveTeamMember = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, userId }: { projectId: string; userId: number }) =>
      projectApi.removeTeamMember(projectId, userId),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.team(projectId) })
      queryClient.invalidateQueries({ queryKey: projectKeys.details(projectId) })
      queryClient.invalidateQueries({ queryKey: projectKeys.curatedList() })
      queryClient.invalidateQueries({ queryKey: projectKeys.managedList() })
      queryClient.invalidateQueries({ queryKey: projectKeys.participatingList() })
      queryClient.invalidateQueries({ queryKey: projectKeys.timesheetSummary(projectId) })
    }
  })
}

export const useSetProjectStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, status }: { projectId: string; status: ProjectStatus | string }) =>
      projectApi.setProjectStatus(projectId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all })
    }
  })
}


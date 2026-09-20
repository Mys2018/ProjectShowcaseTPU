/* eslint-disable fsd/no-cross-slice-dependency */
/* eslint-disable fsd/forbidden-imports */
import type {
  ProjectCardData,
  ProjectsResponseDto,
  GetProjectsQueryParams,
  CreateProjectDto,
  ProjectDto,
  GetProjectsResponse,
  GetLikedProjectsParams,
  GetManagedProjectsParams,
  GetParticipatingProjectsParams,
  GetAppliedProjectsParams,
  GetProjectReviewResponse,
  ProjectStatus,
  ProjectSprint,
  SprintGradingStatus,
  SprintHoursBatch,
  ProjectTimesheetSummaryResponse,
} from '../model/types'
import { mapProjectDtoToEntity } from '../lib/mappers'
import type { UserCard } from '@/entities/user'
import { api, ENDPOINTS } from '@/shared'

export interface ProjectDraftResponse {
  data: Record<string, unknown>
  updatedAt: string
}

export const projectApi = {
  getDraft: async (): Promise<ProjectDraftResponse> => {
    const { data } = await api.get<ProjectDraftResponse>(ENDPOINTS.PROJECT_DRAFT)
    return data
  },

  saveDraft: async (data: Record<string, unknown>): Promise<void> => {
    await api.put(ENDPOINTS.PROJECT_DRAFT, data)
  },

  deleteDraft: async (): Promise<void> => {
    await api.delete(ENDPOINTS.PROJECT_DRAFT)
  },

  getProjects: async (params?: GetProjectsQueryParams): Promise<GetProjectsResponse> => {
    const response = await api.get<ProjectsResponseDto>(ENDPOINTS.PROJECTS, {
      params,
      paramsSerializer: {
        indexes: null
      }
    })

    return {
      projects: response.data.hits.map(mapProjectDtoToEntity),
      total: response.data.total
    }
  },

  getProjectById: async (id: string): Promise<ProjectCardData> => {
    const { data } = await api.get<ProjectDto>(ENDPOINTS.PROJECT_BY_ID(id))
    return mapProjectDtoToEntity(data)
  },

  getProjectTeam: async (projectId: string): Promise<UserCard[]> => {
    const { data } = await api.get<UserCard[]>(ENDPOINTS.PROJECT_TEAM(projectId))
    return data
  },

  getProjectSprints: async (projectId: string): Promise<ProjectSprint[]> => {
    const { data } = await api.get<ProjectSprint[]>(ENDPOINTS.PROJECT_SPRINTS(projectId))
    return data
  },

  getSprintGradingStatus: async (projectId: string, sprintId: string): Promise<SprintGradingStatus> => {
    const { data } = await api.get<SprintGradingStatus>(ENDPOINTS.SPRINT_GRADING_STATUS(projectId, sprintId))
    return data
  },

  submitSprintHours: async (projectId: string, { sprintId, records }: SprintHoursBatch): Promise<void> => {
    await api.post(ENDPOINTS.SPRINT_HOURS(projectId, sprintId), { records })
  },

  getProjectTimesheetSummary: async (projectId: string): Promise<ProjectTimesheetSummaryResponse> => {
    const { data } = await api.get<ProjectTimesheetSummaryResponse>(ENDPOINTS.PROJECT_TIMESHEET_SUMMARY(projectId))
    return data
  },

  createProject: async (payload: CreateProjectDto): Promise<string> => {
    const { data } = await api.post<{ projectId: string }>(ENDPOINTS.PROJECTS, payload)
    return data.projectId
  },

  likeProject: async (projectId: string): Promise<void> => {
    await api.post(ENDPOINTS.LIKE_PROJECT(projectId))
  },

  unlikeProject: async (projectId: string): Promise<void> => {
    await api.delete(ENDPOINTS.LIKE_PROJECT(projectId))
  },

  getLikedProjects: async (params?: GetLikedProjectsParams): Promise<GetProjectsResponse> => {
    const { data } = await api.get<ProjectsResponseDto>(ENDPOINTS.LIKED_PROJECTS, { params })
    return { total: data.total, projects: data.hits.map(mapProjectDtoToEntity) }
  },

  getManagedProjects: async (params?: GetManagedProjectsParams): Promise<GetProjectsResponse> => {
    const { data } = await api.get<ProjectsResponseDto>(ENDPOINTS.MANAGED_PROJECTS, { params })
    return { total: data.total, projects: data.hits.map(mapProjectDtoToEntity) }
  },

  getCuratedProjects: async (params?: GetManagedProjectsParams): Promise<GetProjectsResponse> => {
    return projectApi.getManagedProjects(params)
  },

  getParticipatingProjects: async (params?: GetParticipatingProjectsParams): Promise<GetProjectsResponse> => {
    const { data } = await api.get<ProjectsResponseDto>(ENDPOINTS.PARTICIPATING_PROJECTS, { params })
    return { total: data.total, projects: data.hits.map(mapProjectDtoToEntity) }
  },

  getAppliedProjects: async (params?: GetAppliedProjectsParams): Promise<GetProjectsResponse> => {
    const { data } = await api.get<ProjectsResponseDto>(ENDPOINTS.APPLIED_PROJECTS, { params })
    return { total: data.total, projects: data.hits.map(mapProjectDtoToEntity) }
  },

  getProjectModerationReview: async (projectId: string): Promise<string> => {
    const { data } = await api.get<GetProjectReviewResponse>(ENDPOINTS.PROJECT_REVIEW(projectId))
    return data.comment ?? ''
  },

  setProjectModerationReview: async (projectId: string, payload: { verdict: ProjectStatus; comment?: string }): Promise<void> => {
    await api.post(ENDPOINTS.PROJECT_REVIEW(projectId), payload)
  }
}

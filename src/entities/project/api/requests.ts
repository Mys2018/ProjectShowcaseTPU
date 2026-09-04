import type {
  ProjectCardData,
  ProjectsResponseDto,
  GetProjectsQueryParams,
  CreateProjectDto,
  ProjectDto,
  GetProjectsResponse,
  GetLikedProjectsParams,
} from '../model/types'
import { mapProjectDtoToEntity } from '../lib/mappers'
import { api, ENDPOINTS } from '@/shared'

export interface ProjectDraftResponse {
  data: Record<string, unknown>
  updatedAt: string
}

export const projectApi = {
  getDraft: async (): Promise<ProjectDraftResponse> => {
    const response = await api.get<ProjectDraftResponse>(ENDPOINTS.PROJECT_DRAFT)
    return response.data
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
  }
}

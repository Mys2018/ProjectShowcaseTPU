import { api } from '@/shared';
import type {
  ProjectCardData,
  ProjectsResponseDto,
  GetProjectsQueryParams,
  CreateProjectDto,
  ProjectCheckpoints, ProjectResponseCheckpointDto, GetProjectResponseCheckpoint
} from '../model/types';
import { mapProjectDtoToEntity } from '../lib/mapProject';

export const projectApi = {
  getProjects: async (params?: GetProjectsQueryParams): Promise<{ projects: ProjectCardData[]; total: number }> => {
    const response = await api.get<ProjectsResponseDto>('/projects', { 
      params,
      paramsSerializer: {
        indexes: null 
      }
    });
    
    return {
      projects: response.data.hits.map(mapProjectDtoToEntity),
      total: response.data.total
    };
  },

  getProjectById: async (id: string): Promise<ProjectCardData> => {
    const response = await api.get(`/projects/${id}`);
    return mapProjectDtoToEntity(response.data);
  },

  createProject: async (data: CreateProjectDto): Promise<ProjectCardData> => {
    const response = await api.post('/projects', data);
    return mapProjectDtoToEntity(response.data);
  },

  getCheckpoints: async (offset = 1, limit = 1): Promise<ProjectResponseCheckpointDto> => {
    const response = await api.get('/projects/checkpoints', {
      params: {
        offset,
        limit
      }
    })
    return response.data
  },

  createCheckpoints: async (data: ProjectCheckpoints): Promise<GetProjectResponseCheckpoint> => {
    const response = await api.post('/projects/checkpoints', data);
    return response.data;
  },
};
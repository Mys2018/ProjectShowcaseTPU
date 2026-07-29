import { api } from '@/shared';
import type { ProjectCardData, ProjectsResponseDto, GetProjectsQueryParams, CreateProjectDto } from '../model/types';
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
    const response = await api.get<any>(`/projects/${id}`);
    return mapProjectDtoToEntity(response.data);
  },

  createProject: async (data: CreateProjectDto): Promise<ProjectCardData> => {
    const response = await api.post<any>('/projects', data);
    return mapProjectDtoToEntity(response.data);
  },

  createCheckpoints: async (data: { name: string, checkpoints: { title: string, deadline: string }[] }): Promise<{ checkpointId: string }> => {
    const response = await api.post<any>('/projects/checkpoints', data);
    return response.data;
  },
};
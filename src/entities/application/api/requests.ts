import type {
  ListApplicationsResponse,
  ListApplicationsResponseDto,
  GetApplicationsQueryParams,
  CreateApplicationRequest,
  CreateApplicationResponse,
  ProjectRoleApplicationStatus
} from '../model/types';
import { api, ENDPOINTS } from '@/shared';
import { mapListApplicationsResponse } from '../lib/mappers';

export const getApplications = async (params: GetApplicationsQueryParams): Promise<ListApplicationsResponse> => {
  const response = await api.get<ListApplicationsResponseDto>(ENDPOINTS.APPLICATIONS, {
    params,
    paramsSerializer: {
      indexes: null
    }
  });
  return mapListApplicationsResponse(response.data);
};

export const applicationApi = {
  createApplication: async (payload: CreateApplicationRequest): Promise<CreateApplicationResponse> => {
    const { data } = await api.post<CreateApplicationResponse>(ENDPOINTS.APPLICATIONS, payload);
    return data;
  },

  updateApplicationStatus: async (applicationId: string, status: ProjectRoleApplicationStatus): Promise<void> => {
    await api.post(ENDPOINTS.APPLICATION_SET_STATUS(applicationId, status));
  },
};

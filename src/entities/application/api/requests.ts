import type {
  ListApplicationsResponse,
  GetApplicationsQueryParams,
  CreateApplicationRequest,
  CreateApplicationResponse,
  ProjectRoleApplicationStatus
} from '../model/types';
import { api, ENDPOINTS } from '@/shared';

export const applicationApi = {
  getApplications: async (params: GetApplicationsQueryParams): Promise<ListApplicationsResponse> => {
    const response = await api.get<ListApplicationsResponse>(ENDPOINTS.APPLICATIONS, {
      params,
      paramsSerializer: {
        indexes: null
      }
    });
    return response.data;
  },

  createApplication: async (payload: CreateApplicationRequest): Promise<CreateApplicationResponse> => {
    const { data } = await api.post<CreateApplicationResponse>(ENDPOINTS.APPLICATIONS, payload);
    return data;
  },

  updateApplicationStatus: async (applicationId: string, status: ProjectRoleApplicationStatus): Promise<void> => {
    await api.post(ENDPOINTS.APPLICATION_SET_STATUS(applicationId, status));
  },
};

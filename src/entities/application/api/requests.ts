import type {
  ListApplicationsResponse,
  ListApplicationsResponseDto,
  GetApplicationsQueryParams,
  CreateApplicationRequest,
  CreateApplicationResponse,
  ApplicationStatus
} from '../model/types'
import { mapListApplicationsResponse } from '../lib/mappers'
import { api, ENDPOINTS } from '@/shared'

export const getApplications = async (params: GetApplicationsQueryParams): Promise<ListApplicationsResponse> => {
  const response = await api.get<ListApplicationsResponseDto>(ENDPOINTS.APPLICATIONS, {
    params,
    paramsSerializer: {
      indexes: null
    }
  })
  return mapListApplicationsResponse(response.data)
}

export const createApplication = async (payload: CreateApplicationRequest): Promise<CreateApplicationResponse> => {
  const { data } = await api.post<CreateApplicationResponse>(ENDPOINTS.APPLICATIONS, payload)
  return data
}

export const updateApplicationStatus = async (applicationId: string, status: ApplicationStatus): Promise<void> => {
  await api.post(ENDPOINTS.APPLICATION_SET_STATUS(applicationId, status))
}

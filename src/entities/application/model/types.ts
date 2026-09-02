export type ApplicationStatus = 'approved' | 'closed' | 'pending' | 'rejected'

export interface Application {
  applicationID: string
  studentID: number
  roleID: string
  createdAt: Date
  status: ApplicationStatus
}

export interface ListApplicationsResponse {
  applications: Application[]
  total: number
  offset: number
  limit: number
}

export interface ApplicationDto {
  applicationID: string
  studentID: number
  roleID: string
  createdAt: string
  status: Capitalize<ApplicationStatus>
}

export interface ListApplicationsResponseDto extends Omit<ListApplicationsResponse, 'applications'> {
  applications: ApplicationDto[]
}

export interface CreateApplicationRequest {
  roleId: string
}

export interface CreateApplicationResponse {
  applicationId: string
}

export interface GetApplicationsQueryParams {
  mode: 'AsStudent' | 'AsOwner'
  status?: ApplicationStatus
  projectId?: string
  offset: number
  limit: number
}

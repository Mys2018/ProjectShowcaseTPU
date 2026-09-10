export type ApplicationStatus = 'approved' | 'closed' | 'pending' | 'rejected' | 'cancelled'
export type ApplicationType = 'Application' | 'Invitation'

export interface Application {
  applicationID: string
  studentID: number
  roleID: string
  projectId: string
  createdAt: Date
  status: ApplicationStatus
  applicationType?: ApplicationType
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
  projectID?: string // TODO required
  createdAt: string
  status: Capitalize<ApplicationStatus>
  applicationType?: ApplicationType
}

export interface ListApplicationsResponseDto extends Omit<ListApplicationsResponse, 'applications'> {
  applications: ApplicationDto[]
}

export interface CreateApplicationRequest {
  roleId: string
  type: ApplicationType
  studentId?: number
}

export interface CreateApplicationResponse {
  applicationId: string
}

export interface GetApplicationsQueryParams {
  mode: 'AsStudent' | 'AsOwner'
  type?: ApplicationType
  status?: ApplicationStatus
  projectId?: string
  offset: number
  limit: number
}

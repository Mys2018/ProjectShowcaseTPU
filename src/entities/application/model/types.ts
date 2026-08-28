export type ProjectRoleApplicationStatus = 'Approved' | 'Closed' | 'Pending' | 'Rejected';

export interface ProjectRoleApplication {
  applicationID: string;
  studentID: number;
  roleID: string;
  createdAt: Date;
  status: ProjectRoleApplicationStatus;
}

export interface ListApplicationsResponse {
  applications: ProjectRoleApplication[];
  total: number;
  offset: number;
  limit: number;
}

export interface ProjectRoleApplicationDto extends Omit<ProjectRoleApplication, 'createdAt'> {
  createdAt: string;
}

export interface ListApplicationsResponseDto extends Omit<ListApplicationsResponse, 'applications'> {
  applications: ProjectRoleApplicationDto[];
}

export interface CreateApplicationRequest {
  roleId: string;
}

export interface CreateApplicationResponse {
  applicationId: string;
}

export interface GetApplicationsQueryParams {
  mode: 'AsStudent' | 'AsOwner';
  status?: ProjectRoleApplicationStatus;
  projectId?: string;
  offset: number;
  limit: number;
}

export type ProjectRoleApplicationStatus = 'Approved' | 'Closed' | 'Pending' | 'Rejected';

export interface ProjectRoleApplication {
  applicationID: string;
  studentID: number;
  roleID: string;
  createdAt: string;
  status: ProjectRoleApplicationStatus;
}

export interface ListApplicationsResponse {
  applications: ProjectRoleApplication[];
  total: number;
  offset: number;
  limit: number;
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

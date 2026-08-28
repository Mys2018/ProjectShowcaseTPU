import type { 
  ProjectRoleApplication, 
  ProjectRoleApplicationDto, 
  ListApplicationsResponse, 
  ListApplicationsResponseDto 
} from '../model/types';

export const mapProjectRoleApplication = (dto: ProjectRoleApplicationDto): ProjectRoleApplication => {
  return {
    ...dto,
    createdAt: new Date(dto.createdAt)
  };
};

export const mapListApplicationsResponse = (dto: ListApplicationsResponseDto): ListApplicationsResponse => {
  return {
    ...dto,
    applications: dto.applications.map(mapProjectRoleApplication)
  };
};

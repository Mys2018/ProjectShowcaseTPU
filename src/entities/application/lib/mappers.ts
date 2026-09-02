import type { Application, ApplicationDto, ListApplicationsResponse, ListApplicationsResponseDto, ApplicationStatus } from '../model/types'

export const mapProjectApplication = (dto: ApplicationDto): Application => {
  return {
    ...dto,
    status: dto.status.toLowerCase() as ApplicationStatus,
    createdAt: new Date(dto.createdAt)
  }
}

export const mapListApplicationsResponse = (dto: ListApplicationsResponseDto): ListApplicationsResponse => {
  return {
    ...dto,
    applications: dto.applications.map(mapProjectApplication)
  }
}

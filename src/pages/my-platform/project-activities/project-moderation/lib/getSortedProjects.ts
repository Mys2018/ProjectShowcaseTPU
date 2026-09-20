import type { ProjectCardData, ProjectStatus } from '@/entities/project'

const getStatusPriority = (status: ProjectStatus): number => {
  switch (status) {
    case 'Pending':
      return 1
    case 'NeedsRework':
      return 2
    case 'Rejected':
      return 3
    default:
      return 4
  }
}

export const getSortedProjects = (projects: ProjectCardData[]): ProjectCardData[] => {
  return projects.toSorted((a, b) => getStatusPriority(a.status) - getStatusPriority(b.status))
}

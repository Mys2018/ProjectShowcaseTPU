import type { Application } from '@/entities/application'

type FilteredApplications = {
  activeApplications: Application[]
  archivedApplications: Application[]
}

export const getFilteredApplications = (applications: Application[]): FilteredApplications => {
  const activeApplications: Application[] = []
  const archivedApplications: Application[] = []
  const thisYear = new Date().getFullYear()

  applications.forEach(application => {
    const { status, createdAt } = application

    if (status === 'pending') {
      activeApplications.push(application)
    } else if (status === 'closed' || status === 'rejected') {
      if (createdAt.getFullYear() === thisYear) {
        archivedApplications.push(application)
      }
    }
  })

  return { activeApplications, archivedApplications }
}

import { getProjectDates, type ProjectCardData } from '@/entities/project'
import type { User } from '@/entities/user'

type ProjectInfo = {
  project: ProjectCardData
  competencyId: string
}

type FilteredProjects = {
  activeProjects: ProjectInfo[]
  archivedProjects: ProjectInfo[]
}

const findCompetenceId = (project: ProjectCardData, studentId: string): string | undefined => {
  for (const role of project.roles) {
    if (role.placeUserIds.some(id => String(id) === studentId)) return role.roleId
  }
}

const getProjectGrade = (studyStartYear: number, openingDate: Date): number => {
  const isAutumnHalf = openingDate.getMonth() > 6
  return openingDate.getFullYear() - studyStartYear + (isAutumnHalf ? 0 : 1)
}

export const getFilteredProjects = (projects: ProjectCardData[], student: User, grade: number): FilteredProjects => {
  const activeProjects: ProjectInfo[] = []
  const archivedProjects: ProjectInfo[] = []

  const isAutumnHalf = new Date().getMonth() > 6
  const studyStartYear = student.grade ? new Date().getFullYear() - Number(student.grade) + (isAutumnHalf ? 1 : 2) : null

  projects.forEach(project => {
    const { status } = project
    if (status === 'InProgress') {
      const competencyId = findCompetenceId(project, student.id)
      if (competencyId) activeProjects.push({ project, competencyId })
    } else if (studyStartYear) {
      const { opening } = getProjectDates(project.checkpoints.checkpoints)
      const projectGrade = opening && getProjectGrade(studyStartYear, opening)
      if (projectGrade && grade === projectGrade) {
        const competencyId = findCompetenceId(project, student.id)
        if (competencyId) archivedProjects.push({ project, competencyId })
      }
    }
  })

  return { activeProjects, archivedProjects }
}

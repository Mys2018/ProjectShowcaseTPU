export type { ProjectCardData, ProjectDirection, ProjectFormat, GetProjectsResponse } from './model/types'
//export { MOCK_PROJECTS } from './model/mockProjects';
export { typeProjectsLabel } from '@/shared/constants/type-project-label/typeProjectsLabel'

export * from './ui'
export * from './model/types'
export * from './api'
export { getProjectFormatTranslation } from './lib/translations'
export { getProjectDates } from './lib/getProjectDates'
export { PROJECT_FORMATS } from './model/constants'
export { getProjectPlural, getScorePlural, getScoreWord } from './lib/plurals'
export { getProjectTagBackground } from './lib/getProjectTagBackground'
export {
  getPublicProjectStatus,
  hasFreePlaces,
  hasFreePlace,
  isActiveParticipatingProject,
} from './lib/publicStatus'
export { useIsInOtherProject, useProjectLimitReached } from './model/participation'
export { useProjectGrading, type ProjectGradingResult } from './model/useProjectGrading'
export { getStudentProjectHours } from './lib/timesheet'
export {
  ALLOWED_COURSES_BY_PROJECT_TYPE,
  isProjectCourseEligible,
  getCourseRestrictionText
} from './lib/courseEligibility'

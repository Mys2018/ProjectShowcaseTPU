export { default as ProjectCard } from './ui/ProjectCard/ProjectCard'
export type { ProjectCardData, ProjectDirection, ProjectFormat } from './model/types'
//export { MOCK_PROJECTS } from './model/mockProjects';
export { typeProjectsLabel } from '@/shared/constants/type-project-label/typeProjectsLabel'

export { ProjectCardFactory } from './ui/ProjectCardFactory/ProjectCardFactory'
export * from './model/types'
export { useProjects, useProjectDetails, useCreateProject, useProjectDraft, useSaveDraft, useDeleteDraft } from './api/queries'
export { getProjectFormatTranslation } from './lib/translations'
export { PROJECT_FORMATS } from './model/constants'
export { getProjectPlural } from './lib/plurals'
export { getProjectTagBackground } from './lib/tags'

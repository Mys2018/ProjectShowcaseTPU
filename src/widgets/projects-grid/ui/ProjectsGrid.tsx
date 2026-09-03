import styles from './ProjectsGrid.module.css'
import { ProjectCardFactory } from './project-card-factory/ProjectCardFactory'
import { useFilterStore } from '@/features/filter'
import { useLikedProjects, useProjects } from '@/entities/project'
import { NoSuitableProjects } from '@/entities/project/ui/no-suitable-projects'

const fallbackProjectsData = { projects: [], total: 0 }

interface ProjectsGridProps {
  type?: 'liked' | 'all'
}

export default function ProjectsGrid({ type = 'all' }: ProjectsGridProps) {
  const { tags, competencies, projectTypes, sort, isRelevanceSort, query, limit, page, reset } = useFilterStore()
  const {
    data: allProjectsData,
    isLoading: isAllLoading,
    isError: isAllError
  } = useProjects(
    {
      q: query,
      projectType: Array.from(projectTypes),
      tagId: Array.from(tags),
      roleTypeId: Array.from(competencies),
      sort: isRelevanceSort ? 'relevance' : sort,
      limit: limit,
      offset: (page - 1) * limit
    },
    type === 'all'
  )
  const { data: likedProjectsData, isLoading: isLikedLoading, isError: isLikedError } = useLikedProjects({}, type === 'liked')
  const { projects, total } = type === 'all' ? allProjectsData || fallbackProjectsData : likedProjectsData || fallbackProjectsData
  const isLoading = type === 'all' ? isAllLoading : isLikedLoading
  const isError = type === 'all' ? isAllError : isLikedError

  if (isLoading) return <h2>Загрузка проектов...</h2>
  if (isError) return <h2>Ошибка при загрузке проектов</h2>
  if (!total && projectTypes.size !== 0 && tags.size !== 0 && competencies.size !== 0)
    return (
      <div className={styles.emptyContainer}>
        <NoSuitableProjects onClear={reset} />
      </div>
    )
  if (!total) return <p>Нет проектов на платформе</p>

  return (
    <div className={styles.body}>
      {projects.map(project => (
        <ProjectCardFactory key={project.id} project={project} />
      ))}
    </div>
  )
}

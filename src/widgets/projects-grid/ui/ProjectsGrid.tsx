import styles from './ProjectsGrid.module.css'
import { ProjectCardFactory } from './project-card-factory/ProjectCardFactory'
import { useFilterStore } from '@/features/filter'
import { useProjects } from '@/entities/project'
import {NoSuitableProjects} from "@/entities/project/ui/no-suitable-projects";

export default function ProjectsGrid() {
  const { tags, competencies, projectTypes, sort, isRelevanceSort, query, limit, page, reset } = useFilterStore()
  const { data, isLoading, isError } = useProjects({
    q: query,
    projectType: Array.from(projectTypes),
    tagId: Array.from(tags),
    roleTypeId: Array.from(competencies),
    sort: isRelevanceSort ? 'relevance' : sort,
    limit: limit,
    offset: (page - 1) * limit
  })
  const { projects, total } = data || { projects: [], total: 0 }

  if (isLoading) return <h2>Загрузка проектов...</h2>
  if (isError) return <h2>Ошибка при загрузке проектов</h2>
  if (!total && projectTypes.size !== 0 && tags.size !== 0 && competencies.size !== 0) return (
    <div className={styles.emptyContainer}>
      <NoSuitableProjects onClear={reset}/>
    </div>
  )
  if (!total) return (
    <p>
      Нет проектов на платформе
    </p>
  )


  return (
    <div className={styles.body}>
      {projects.map(project => (
        <ProjectCardFactory key={project.id} project={project} />
      ))}
    </div>
  )
}

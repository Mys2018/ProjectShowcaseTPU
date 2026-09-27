import { useState, useEffect } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import styles from './ApplicationsAndTeam.module.css'
import { ApplicationsPanel } from '@/features/manage-applications'
import { MiniProjectCard, useCuratedProjects } from '@/entities/project'
import { ProjectSkeleton } from '@/shared'

export const ApplicationsAndTeam = () => {
  const { data: projects, isLoading: isProjectsLoading } = useCuratedProjects({ limit: 100 })
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const queryProjectId = searchParams.get('projectId') || (location.state as { projectId?: string } | null)?.projectId
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(queryProjectId || null)

  useEffect(() => {
    const targetId = searchParams.get('projectId') || (location.state as { projectId?: string } | null)?.projectId
    if (targetId) {
      setSelectedProjectId(targetId)
    }
  }, [searchParams, location.state])

  // Только проекты на этапе набора — архив/завершённые/в работе сюда не попадают.
  const projectList = (projects?.projects || []).filter((p) => p.status === 'Recruiting')
  const activeProjectId = (selectedProjectId && projectList.some((p) => p.id === selectedProjectId))
    ? selectedProjectId
    : (projectList[0]?.id || null)
  const selectedProject = projectList.find((p) => p.id === activeProjectId) || null

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId)
  }


  return (
    <>
      <aside className={styles.projects}>
        {isProjectsLoading ? (
          <>
            <ProjectSkeleton style={{ minHeight: 90, borderRadius: 20 }} />
            <ProjectSkeleton style={{ minHeight: 90, borderRadius: 20 }} />
          </>
        ) : (
          projectList.map((project) => (
            <div
              key={project.id}
              className={`${styles.projectItem} ${project.id === activeProjectId ? styles.projectItemActive : ''}`}
              onClick={() => handleSelectProject(project.id)}
            >
              <MiniProjectCard project={project} type={'applications'} />
            </div>
          ))
        )}
      </aside>

      <main className={styles.main}>
        {isProjectsLoading ? (
          <div className={styles.emptyMain} aria-busy="true">
            <ProjectSkeleton style={{ width: '100%', height: 300, borderRadius: 20 }} />
          </div>
        ) : selectedProject ? (
          <ApplicationsPanel project={selectedProject} />
        ) : (
          <div className={styles.emptyMain}>
            <p>{projectList.length === 0 ? 'Нет проектов на этапе набора' : 'Выберите проект для управления откликами'}</p>
          </div>
        )}
      </main>
    </>
  )
}


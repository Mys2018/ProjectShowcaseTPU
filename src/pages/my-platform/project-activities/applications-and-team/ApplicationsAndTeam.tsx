import { useState, useEffect } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import styles from './ApplicationsAndTeam.module.css'
import { ApplicationsPanel } from '@/features/manage-applications'
import { MiniProjectCard, useCuratedProjects } from '@/entities/project'

export const ApplicationsAndTeam = () => {
  const { data: projects } = useCuratedProjects({ limit: 100 })
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

  const projectList = projects?.projects || []
  const activeProjectId = (selectedProjectId && projectList.some((p) => p.id === selectedProjectId))
    ? selectedProjectId
    : (selectedProjectId && projectList.length === 0 ? selectedProjectId : (projectList[0]?.id || null))
  const selectedProject = projectList.find((p) => p.id === activeProjectId) || null

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId)
  }


  return (
    <>
      <aside className={styles.projects}>
        {projectList.map((project) => (
          <div
            key={project.id}
            className={`${styles.projectItem} ${project.id === activeProjectId ? styles.projectItemActive : ''}`}
            onClick={() => handleSelectProject(project.id)}
          >
            <MiniProjectCard project={project} type={'applications'} />
          </div>
        ))}
      </aside>

      <main className={styles.main}>
        {selectedProject ? (
          <ApplicationsPanel project={selectedProject} />
        ) : (
          <div className={styles.emptyMain}>
            <p>Выберите проект для управления откликами</p>
          </div>
        )}
      </main>
    </>
  )
}


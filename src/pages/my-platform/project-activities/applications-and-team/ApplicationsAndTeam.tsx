import { useState } from 'react'
import styles from './ApplicationsAndTeam.module.css'
import { MiniProjectCard, useCuratedProjects } from '@/entities/project'
import { ApplicationsPanel } from '@/features/manage-applications'

export const ApplicationsAndTeam = () => {
  const { data: projects } = useCuratedProjects()
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  const projectList = projects?.projects || []
  const activeProjectId = selectedProjectId || projectList[0]?.id || null
  const selectedProject = projectList.find((p) => p.id === activeProjectId) || null

  return (
    <>
      <aside className={styles.projects}>
        {projectList.map((project) => (
          <div
            key={project.id}
            className={`${styles.projectItem} ${project.id === activeProjectId ? styles.projectItemActive : ''}`}
            onClick={() => setSelectedProjectId(project.id)}
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

import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import styles from './ProjectModerationPage.module.css'
import { getSortedProjects } from './lib/getSortedProjects'
import { ProjectModeration } from '@/widgets/project-moderation'
import {
  NoProjectsFallback,
  ProjectCardVertical,
  ProjectModerationStatus,
  useProjects,
  type ProjectCardData,
} from '@/entities/project'
import { ProjectSkeleton, TextSkeleton } from '@/shared'

export function ProjectModerationPage() {
  const { data, isLoading } = useProjects({ sort: 'created_desc' })
  const projects = data ? getSortedProjects(data.projects) : []

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

  const canProjectBeChosen = (project: ProjectCardData) => project.status === 'Pending'

  const selectedProject = selectedProjectId ? projects.find(p => p.id === selectedProjectId) : null
  const activeProject =
    (selectedProject && canProjectBeChosen(selectedProject) ? selectedProject : null) ??
    projects.find(canProjectBeChosen) ??
    null

  const activeProjectId = activeProject?.id ?? null

  const handleSelectProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId)
    if (project && canProjectBeChosen(project)) {
      setSelectedProjectId(projectId)
    }
  }

  return (
    <>
      <aside className={styles.side}>
        {isLoading
          ? Array.from({ length: 4 }, (_, i) => <ProjectSkeleton className={styles.skeleton} key={i} />)
          : projects.map(project => (
              <ProjectCardVertical
                key={project.id}
                className={clsx(
                  styles.project,
                  canProjectBeChosen(project) && styles.pointer,
                  project.id === activeProjectId && styles.active
                )}
                project={project}
                onClick={() => handleSelectProject(project.id)}
                small
                headerSlot={<ProjectModerationStatus status={project.status} className={styles.status} />}
              />
            ))}
      </aside>
      <main className={styles.content}>
        {isLoading ? (
          <div className={styles.skeleton}>
            <TextSkeleton />
            <TextSkeleton />
            <ProjectSkeleton className={styles.project} />
            <TextSkeleton />
            <ProjectSkeleton className={styles.project} />
          </div>
        ) : activeProject ? (
          <ProjectModeration project={activeProject} />
        ) : (
          <NoProjectsFallback title='Активного проекта пока нет' description='Выберите проект чтобы начать рассмотрение' />
        )}
      </main>
    </>
  )
}

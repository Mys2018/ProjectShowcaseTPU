import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import styles from './ProjectModerationPage.module.css'
import { getSortedProjects } from './lib/getSortedProjects'
import { ProjectModeration } from '@/widgets/project-moderation'
import {
  MiniProjectCard,
  NoProjectsFallback,
  ProjectModerationStatus,
  useProjects,
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

  const activeProjectId = (selectedProjectId && projects.some((p) => p.id === selectedProjectId))
    ? selectedProjectId
    : (projects[0]?.id || null)

  const activeProject = projects.find((p) => p.id === activeProjectId) || null

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId)
  }

  return (
    <>
      <aside className={styles.side}>
        {isLoading
          ? Array.from({ length: 4 }, (_, i) => <ProjectSkeleton className={styles.skeleton} key={i} />)
          : projects.map(project => (
              <div
                key={project.id}
                className={clsx(
                  styles.projectItem,
                  project.id === activeProjectId && styles.projectItemActive
                )}
                onClick={() => handleSelectProject(project.id)}
              >
                <MiniProjectCard
                  project={project}
                  type='moderation'
                  headerSlot={<ProjectModerationStatus status={project.status} />}
                />
              </div>
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

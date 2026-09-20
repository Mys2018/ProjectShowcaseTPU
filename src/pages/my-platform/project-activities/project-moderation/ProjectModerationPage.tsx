import clsx from 'clsx'
import { useEffect, useState } from 'react'
import styles from './ProjectModerationPage.module.css'
import { getSortedProjects } from './lib/getSortedProjects'
import { ProjectModeration } from '@/widgets/project-moderation'
import { NoProjectsFallback, ProjectCardVertical, ProjectModerationStatus, useProjects, type ProjectCardData } from '@/entities/project'
import { ProjectSkeleton, TextSkeleton } from '@/shared'

export function ProjectModerationPage() {
  const { data, isLoading } = useProjects({ sort: 'created_desc' })
  const projects = data ? getSortedProjects(data.projects) : []
  const [activeProject, setActiveProject] = useState<ProjectCardData>()

  const canProjectBeChosen = (project: ProjectCardData) => project.status === 'Pending' || project.status === 'NeedsRework'

  useEffect(() => {
    if (!activeProject) {
      let i = 0
      while (i < projects.length && !canProjectBeChosen(projects[i])) i++
      if (i < projects.length) setActiveProject(projects[i])
    }
  }, [projects])

  return (
    <>
      <div className={styles.side}>
        {isLoading
          ? Array.from({ length: 4 }, (_, i) => <ProjectSkeleton className={styles.skeleton} key={i} />)
          : projects.map(project => (
              <ProjectCardVertical
                key={project.id}
                className={clsx(
                  styles.project,
                  canProjectBeChosen(project) && styles.pointer,
                  activeProject?.id === project.id && styles.active
                )}
                project={project}
                onClick={() => setActiveProject(project)}
                small
                headerSlot={<ProjectModerationStatus status={project.status} className={styles.status} />}
              />
            ))}
      </div>
      <div className={styles.content}>
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
      </div>
    </>
  )
}

import { useState, useEffect } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import clsx from 'clsx'
// та же раскладка, что у «Отклики и команда»: карточки проектов слева, работа справа
import styles from '../applications-and-team/ApplicationsAndTeam.module.css'
import { GradingPanel } from '@/widgets/scoring-table'
import { MiniProjectCard, useCuratedProjects } from '@/entities/project'
import {EmptyBlanking} from "@/shared/ui/empty-blanking";

export const ParticipantsGrading = () => {
  const { data } = useCuratedProjects({ limit: 100 })
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [searchParams] = useSearchParams()
  const location = useLocation()

  const routeState = location.state as { projectId?: string; studentId?: string } | null
  const targetProjectId = searchParams.get('projectId') || routeState?.projectId

  useEffect(() => {
    if (targetProjectId) {
      setSelectedProjectId(targetProjectId)
    }
  }, [targetProjectId])

  // Часы выставляются только по спринтам — они есть у проектов в работе
  const projects = (data?.projects ?? []).filter(p => p.status === 'InProgress')
  const selected = projects.find(p => p.id === selectedProjectId) ?? projects[0]

  return (
    <>
      <aside className={styles.projects}>
        {projects.map(project => (
          <div
            key={project.id}
            className={clsx(styles.projectItem, project.id === selected?.id && styles.projectItemActive)}
            onClick={() => setSelectedProjectId(project.id)}
          >
            <MiniProjectCard project={project} type="rating" />
          </div>
        ))}
      </aside>

      <main className={styles.main}>
        {selected ? (
          <GradingPanel
            key={selected.id}
            projectId={selected.id}
            title={selected.meta.title}
            // пришли кнопкой «Оценить работу участника» — подсветить его строку
            highlightStudentId={selected.id === targetProjectId ? routeState?.studentId : undefined}
          />
        ) : (
          <EmptyBlanking text={'Нет проектов в работе — оценивать пока некого'}/>
        )}
      </main>
    </>
  )
}

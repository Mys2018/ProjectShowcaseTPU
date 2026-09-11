import clsx from 'clsx'
import { useEffect, useState } from 'react'
import styles from './ParticipatingProjectsPage.module.css'
import { getFilteredProjects } from './lib/getFIlteredProjects'
import { StudentParticipatingProjectCard } from '@/widgets/student-project-card'
import { useMe } from '@/entities/user'
import { CompletedProjects, NoProjectsFallback, useParticipatingProjects } from '@/entities/project'
import {useNavigate} from "react-router-dom";
import {ROUTES} from "@/shared";

export function ParticipatingProjectsPage() {
  const { data } = useParticipatingProjects()
  const navigate = useNavigate()
  const projects = data?.projects || []

  const { data: me } = useMe()
  const myGrade = me?.grade ?? 1

  const [selectedArchiveGrade, setSelectedArchiveGrade] = useState(myGrade)
  useEffect(() => setSelectedArchiveGrade(myGrade), [me])

  const { activeProjects, archivedProjects } = me
    ? getFilteredProjects(projects, me, selectedArchiveGrade)
    : { activeProjects: [], archivedProjects: [] }

  const hasActiveProjects = activeProjects.length > 0
  const hasArchivedProjects = archivedProjects.length > 0

  return (
    <>
      <div className={styles.activeBlock}>
        <h3 className={styles.title}>Активные проекты</h3>
        <div className={styles.list}>
          {hasActiveProjects ? (
            activeProjects.map(({ project, competencyId }) => (
              <StudentParticipatingProjectCard key={project.id} project={project} competencyId={competencyId} />
            ))
          ) : (
            <NoProjectsFallback
              title='Активного проекта пока нет'
              description='Переходите в каталог проектов, выбирайте интересующие и успевайте подать заявки до конца набора!'
              buttonType={"green"}
              buttonText={'Выбрать проект'}
              onClick={() => {
                navigate(ROUTES.PROJECTS.BASE)
              }}
            />
          )}
        </div>
      </div>
      <CompletedProjects
        title="История откликов"
        switchComponent={
          <div className={styles.buttonList}>
            {Array.from({ length: myGrade }, (_, i) => (
              <button
                className={clsx(styles.gradeButton, i + 1 === selectedArchiveGrade && styles.active)}
                onClick={() => setSelectedArchiveGrade(i + 1)}
                type='button'
                key={i + 1}
              >
                {i + 1} курс
              </button>
            ))}
          </div>
        }
        isEmpty={!hasArchivedProjects}
        emptyTitle={`На ${selectedArchiveGrade} курсе вы не участвовали в проектах`}
        emptySubtitle="Выбирайте подходящие проекты из каталога. Все проекты, в которых вы участвовали, будут храниться здесь вместе со статистикой."
      >
        {archivedProjects.map(({ project, competencyId }) => (
          <StudentParticipatingProjectCard key={project.id} project={project} competencyId={competencyId} />
        ))}
      </CompletedProjects>
    </>
  )
}

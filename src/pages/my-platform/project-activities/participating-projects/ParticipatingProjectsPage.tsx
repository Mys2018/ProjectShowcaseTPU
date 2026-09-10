import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ParticipatingProjectsPage.module.css'
import { getFilteredProjects } from './lib/getFIlteredProjects'
import { StudentParticipatingProjectCard } from '@/widgets/student-project-card'
import { useMe } from '@/entities/user'
import { NoProjectsFallback, useParticipatingProjects } from '@/entities/project'

export function ParticipatingProjectsPage() {
  const navigate = useNavigate()
  const thisYear = new Date().getFullYear()

  const { data } = useParticipatingProjects()
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
            />
          )}
        </div>
      </div>
      <div className={styles.archived}>
        <div className={styles.header}>
          <h3 className={styles.title}>История откликов</h3>
          <div className={styles.buttonList}>
            {Array.from({ length: myGrade }, (_, i) => (
              <button
                className={clsx(styles.gradeButton, myGrade - i === selectedArchiveGrade && styles.active)}
                onClick={() => setSelectedArchiveGrade(myGrade - i)}
                type='button'
                key={i}
              >
                {myGrade - i} курс
              </button>
            ))}
          </div>
        </div>
        <div className={styles.list}>
          {hasArchivedProjects ? (
            archivedProjects.map(({ project, competencyId }) => (
              <StudentParticipatingProjectCard key={project.id} project={project} competencyId={competencyId} />
            ))
          ) : (
            <div className={styles.description}>
              <h5 className={styles.heading}>В {thisYear} году вы не участвовали в проектах</h5>
              <p className={styles.paragraph}>
                Выбирайте подходящие проекты из каталога. Все проекты, в которых вы участвовали, будут храниться здесь вместе со
                статистикой.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

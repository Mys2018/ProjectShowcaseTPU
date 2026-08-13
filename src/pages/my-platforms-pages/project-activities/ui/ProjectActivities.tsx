import { useEffect, useRef } from 'react'
import styles from './ProjectActivities.module.css'
import { ProjectsGrid } from '@/widgets/projects-grid'
import { getSwitchableRolesAmount, ROLES_TRANSLATIONS, useMe, usePreferencesStore, UserRow, UserRowSkeleton } from '@/entities/user'
import { FloatingTabs, StagesWidget, YourPointsWidget, YourTasksWidget, type Activity, type ClosingDiscipline } from '@/shared'

export const ProjectActivities = () => {
  const { data: user } = useMe()
  const { preferredRoleType, setPreferredRoleType } = usePreferencesStore()

  const mockedData: { activities?: Activity[]; closingDisciplines: ClosingDiscipline[] } = {
    activities: [
      {
        type: 'currentStage',
        title: 'Подготовка презентации',
        deadline: '5-06-2026',
        progressSteps: 5,
        progressCurrentStep: 5,
        unitType: 'points'
      },
      {
        type: 'upcomingStage',
        title: 'Подготовка презентации',
        progressSteps: 1,
        progressCurrentStep: 0,
        unitType: 'points'
      },
      {
        type: 'keyPoint',
        title: 'Постерная сессия 1',
        deadline: '29-05-2026',
        status: 'completed',
        number: 1,
        extra: 'tooltip'
      }
    ],
    closingDisciplines: [
      {
        title: 'УИРС-1',
        currentProgress: 18,
        maxProgress: 36
      },
      {
        title: 'УИРС-2',
        currentProgress: 0,
        maxProgress: 36
      }
    ]
  } // TODO заменить на реальные данные

  const switchableRoles = user ? getSwitchableRolesAmount(user.roles) : []
  const tabItems = switchableRoles.map(role => ({ label: ROLES_TRANSLATIONS[role.type], value: role.type }))

  const activitiesRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const activitiesElement = activitiesRef.current
    const contentElement = contentRef.current
    if (activitiesElement) {
      const scrollHeight = activitiesElement.scrollHeight
      activitiesElement.style.top = `calc(100% - ${scrollHeight}px)`
    }
    if (contentElement) {
      const scrollHeight = contentElement.scrollHeight
      contentElement.style.top = `calc(100% - ${scrollHeight}px)`
    }
  }, [])

  return (
    <div className={`${styles.container} ${styles[preferredRoleType.toLowerCase()]}`}>
      <div className={styles.header}>
        {user ? <UserRow className={styles.userRow} user={user} /> : <UserRowSkeleton />}
        <div className={styles.start}>
          <h1 className={styles.welcomeMessage}>C возвращением, {user?.meta.firstName}!</h1>
          {switchableRoles.length > 1 && <FloatingTabs items={tabItems} value={preferredRoleType} onChange={setPreferredRoleType} />}
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.activities} ref={activitiesRef}>
          <YourTasksWidget data={mockedData.activities} />
          <YourPointsWidget disciplines={mockedData.closingDisciplines} tpuPoints={307} />
        </div>
        <div className={styles.content} ref={contentRef}>
          <div className={styles.overview}>
            <span className={styles.banner} />
            <StagesWidget />
          </div>
          <div className={styles.projects}>
            <h3 className={styles.title}>Проекты для вас</h3>
            <ProjectsGrid />
          </div>
        </div>
      </div>
    </div>
  )
}

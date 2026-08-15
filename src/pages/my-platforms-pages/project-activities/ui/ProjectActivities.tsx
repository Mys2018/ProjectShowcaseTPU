import clsx from 'clsx'
import { useRef } from 'react'
import styles from './ProjectActivities.module.css'
import { ProjectsGrid } from '@/widgets/projects-grid'
import {
  getSwitchableRoles,
  ROLES_TRANSLATIONS,
  useMe,
  usePreferencesStore,
  UserRow,
  UserRowSkeleton,
  type UserRole
} from '@/entities/user'
import {
  FloatingTabs,
  StagesWidget,
  YourPointsWidget,
  YourTasksWidget,
  type Activity,
  type ClosingDiscipline,
  type FloatingTabItem
} from '@/shared'
// import {useProjectDraft} from "@/entities/project";
// import {useNavigate} from "react-router-dom";

export const ProjectActivities = () => {
  const { data: user } = useMe()
  const { preferredRoleType, setPreferredRoleType } = usePreferencesStore()

  // const { data: draft } = useProjectDraft();
  // const navigate = useNavigate();
  //
  // const draftTitle = (draft?.data as Record<string, { title?: string }>)?.meta?.title || 'Без названия';
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

  const switchableRoles = user ? getSwitchableRoles(user.roles) : []
  const tabItems: FloatingTabItem<UserRole['type']>[] = switchableRoles
    .sort((a, b) => a.weight - b.weight)
    .map(role => ({ label: ROLES_TRANSLATIONS[role.type], value: role.type }))
  const isHeroWrapperVisible = switchableRoles.some(role => role.type !== 'Student')

  const activitiesRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLSpanElement>(null)
  const shapeRef = useRef<HTMLSpanElement>(null)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop

    const activitiesElement = activitiesRef.current
    const contentElement = contentRef.current
    const bgElement = bgRef.current
    const shapeElement = shapeRef.current

    if (activitiesElement) activitiesElement.scrollTop = scrollTop
    if (contentElement) contentElement.scrollTop = scrollTop
    if (bgElement) bgElement.style.transform = `translateY(-${scrollTop}px)`
    if (shapeElement) shapeElement.style.transform = `translateY(-${Math.min(338, scrollTop)}px)`
  }

  return (
    <main className={`${styles.container} ${styles[preferredRoleType.toLowerCase()]}`} onScroll={handleScroll}>
      <span className={`${styles.background} ${styles.fixed}`} />
      <span className={styles.background} ref={bgRef} />
      <span className={`${styles.background} ${styles.shaped}`} ref={shapeRef} />

      <aside className={styles.userRow}>{user ? <UserRow user={user} /> : <UserRowSkeleton />}</aside>

      <div className={styles.titleContainer}>
        {user && <h1 className={`ellipsis ${styles.welcomeMessage}`}>C возвращением, {user.meta.firstName}!</h1>}
      </div>

      {switchableRoles.length > 1 && (
        <aside className={styles.switchContainer}>
          <FloatingTabs className={styles.roleSwitcher} items={tabItems} value={preferredRoleType} onChange={setPreferredRoleType} />
        </aside>
      )}

      <aside className={styles.activities} ref={activitiesRef} onScroll={handleScroll}>
        <YourTasksWidget data={mockedData.activities} />
        <YourPointsWidget disciplines={mockedData.closingDisciplines} tpuPoints={307} />
      </aside>
      <div className={styles.content} ref={contentRef} onScroll={handleScroll}>
        <div className={clsx(styles.heroWrapper, isHeroWrapperVisible && styles.visible)}>
          <div className={styles.bannerContainer}>
            <span className={styles.banner} />
          </div>
          <section className={styles.stagesWidget}>
            <StagesWidget />
          </section>
        </div>
        <section className={styles.projects}>
          <h3 className={styles.title}>Проекты для вас</h3>
          <ProjectsGrid />
        </section>
      </div>
    </main>
  )
}

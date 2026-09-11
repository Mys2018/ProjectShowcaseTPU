import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import styles from './MyPlatformPage.module.css'
import { ProjectsGrid } from '@/widgets/projects-grid'
import { CuratorWidget } from '@/widgets/my-platform-widgets'
import {
  Avatar,
  getSwitchableRoles,
  ROLES_TRANSLATIONS,
  useMe,
  usePreferencesStore,
  UserRowSkeleton,
  type UserSwitchableRole
} from '@/entities/user'
import { TeamUserCard } from '@/entities/user/ui'
import {
  FloatingTabs,
  StagesWidget,
  YourPointsWidget,
  YourTasksWidget,
  type Activity,
  type ClosingDiscipline,
  type FloatingTabItem,
  ROUTES,
  assertNever
} from '@/shared'

export const MyPlatformPage = () => {
  const { data: user } = useMe()
  const { preferredRoleType, setPreferredRoleType } = usePreferencesStore()
  const navigate = useNavigate()

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
  const tabItems: FloatingTabItem<UserSwitchableRole['type']>[] = switchableRoles
    .sort((a, b) => a.weight - b.weight)
    .map(role => ({ label: ROLES_TRANSLATIONS[role.type], value: role.type }))
  const isHeroWrapperVisible = switchableRoles.some(role => role.type !== 'Student')

  const activitiesRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLSpanElement>(null)
  const shapeRef = useRef<HTMLSpanElement>(null)

  const programmaticScrolls = useRef(new WeakSet<HTMLElement>())

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget

    if (programmaticScrolls.current.has(target)) {
      programmaticScrolls.current.delete(target)
      return
    }

    const scrollTop = target.scrollTop

    const activitiesElement = activitiesRef.current
    const contentElement = contentRef.current
    const bgElement = bgRef.current
    const shapeElement = shapeRef.current

    if (activitiesElement && activitiesElement !== target) {
      if (activitiesElement.scrollTop !== scrollTop) {
        programmaticScrolls.current.add(activitiesElement)
        activitiesElement.scrollTop = scrollTop
      }
    }
    if (contentElement && contentElement !== target) {
      if (contentElement.scrollTop !== scrollTop) {
        programmaticScrolls.current.add(contentElement)
        contentElement.scrollTop = scrollTop
      }
    }
    if (contentElement) {
      if (bgElement) bgElement.style.transform = `translateY(-${contentElement.scrollTop}px)`
      if (shapeElement) shapeElement.style.transform = `translateY(-${Math.min(338, contentElement.scrollTop)}px)`
    }
  }

  const renderContent = () => {
    switch (preferredRoleType) {
      case 'Student':
        return (
          <>
            <h3 className={styles.title}>Проекты для вас</h3>
            <ProjectsGrid />
          </>
        )
      case 'Curator':
        return <CuratorWidget />
      case 'Moderator':
      case null:
        return <></>
      default:
        return assertNever(preferredRoleType)
    }
  }

  return (
    <main className={`${styles.container} ${preferredRoleType ? styles[preferredRoleType.toLowerCase()] : ''}`} onScroll={handleScroll}>
      <span className={`${styles.background} ${styles.fixed}`} />
      <span className={styles.background} ref={bgRef} />
      <span className={`${styles.background} ${styles.shaped}`} ref={shapeRef} />

      <aside className={styles.userRow}>
        {user ? (
          <div
            className={styles.userRowContainer}
            onClick={() => {
              navigate(ROUTES.PROFILE.BASE)
            }}
          >
            <TeamUserCard
              avatar={<Avatar fallbackType={'user'} size={'40px'} strokeColor={'grey'} />}
              firstName={user.meta.firstName}
              lastName={user.meta.lastName}
              nameTextStyle={'ALS'}
              nameSubtextStyle={'OS-10-400'}
              nameStyle={'normal'}
              roles={user.competencies}
            />
          </div>
        ) : (
          <UserRowSkeleton />
        )}
      </aside>

      <div className={styles.titleContainer}>
        {user && <h1 className={`ellipsis ${styles.welcomeMessage}`}>C возвращением, {user.meta.firstName}!</h1>}
      </div>

      {switchableRoles.length > 1 && preferredRoleType && (
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
        <section className={styles.projects}>{renderContent()}</section>
      </div>
    </main>
  )
}

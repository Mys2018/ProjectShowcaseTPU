import clsx from 'clsx'
import { useEffect, useRef } from 'react'
import styles from './MyPlatformPage.module.css'
import { MyPlatformBanner } from './MyPlatformBanner'
import { MyPlatformProjectsWidgets } from "@/pages/my-platform/main/MyPlatformProjectsWidgets.tsx";
import {
  Avatar,
  getSwitchableRoles,
  ROLES_TRANSLATIONS,
  TeamUserCard,
  useMe,
  usePreferencesStore,
  UserRowSkeleton,
  type UserSwitchableRole
} from '@/entities/user'
import {
  FloatingTabs,
  StagesWidget,
  YourPointsWidget,
  // YourTasksWidget,
  type Activity,
  type ClosingDiscipline,
  type FloatingTabItem
} from '@/shared'

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

export function MyPlatformPage() {
  const { data: me } = useMe()
  const { preferredRoleType, setPreferredRoleType } = usePreferencesStore()

  const switchableRoles = getSwitchableRoles(me ? me.roles : [])
  const tabItems: FloatingTabItem<UserSwitchableRole['type']>[] = [...switchableRoles]
    .sort((a, b) => a.weight - b.weight)
    .map(role => ({ label: ROLES_TRANSLATIONS[role.type], value: role.type }))

  const scrollRef = useRef<HTMLDivElement>(null)
  const sideRef = useRef<HTMLDivElement>(null)

  const userRowRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  const coverRef = useRef<HTMLSpanElement>(null)
  const coverFixedRef = useRef<HTMLSpanElement>(null)
  const coverShapedRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const row = userRowRef.current
    const hero = heroRef.current
    const cover = coverRef.current
    const coverFixed = coverFixedRef.current
    const coverShaped = coverShapedRef.current

    const scroller = scrollRef.current
    const side = sideRef.current

    let sideBaseTop = 0
    let sideHeight = 0
    let viewportPaddingTop = 0
    let rowTop = 0
    let rowBottom = 0

    let rowBottomInContent = 0
    let heroBottomInContent = 0

    const measure = () => {
      if (!scroller || !side) return
      side.style.top = '0px'

      const scrollerRect = scroller.getBoundingClientRect()
      const sideRect = side.getBoundingClientRect()

      sideBaseTop = sideRect.top - scrollerRect.top + scroller.scrollTop
      sideHeight = side.offsetHeight
      viewportPaddingTop = Number(window.getComputedStyle(scroller).paddingTop.slice(0, -2))

      if (row) {
        const rowRect = row.getBoundingClientRect()
        rowBottomInContent = rowRect.bottom + scroller.scrollTop
        rowTop = rowRect.top
        rowBottom = rowRect.bottom
      }

      if (hero) {
        const heroRect = hero.getBoundingClientRect()
        heroBottomInContent = heroRect.bottom + scroller.scrollTop
      }
    }

    const updateSide = () => {
      if (!scroller || !side || !row) return

      const viewportHeight = scroller.clientHeight
      const stopAt = sideBaseTop + sideHeight - viewportHeight

      if (stopAt <= 0) {
        side.style.top = `${rowBottom - rowTop}px`
        return
      }

      const scrollTop = scroller.scrollTop
      if (scrollTop - stopAt < 0) {
        side.style.top = `${-scrollTop}px`
      } else {
        side.style.top = `${viewportHeight - sideHeight - viewportPaddingTop}px`
      }
    }

    const updateCovers = () => {
      if (!scroller) return

      const rowBottomViewport = rowBottomInContent + 8
      const heroBottomViewport = heroBottomInContent - scroller.scrollTop + 36

      const stopAt = window.innerWidth > 768 ? Math.max(heroBottomViewport, rowBottomViewport) : scroller ? 468 - scroller.scrollTop : 0

      if (coverFixed) coverFixed.style.setProperty('--fixedCoverHeight', `${rowBottom + 8}px`)
      if (cover) cover.style.setProperty('--scrollableCoverHeight', `${stopAt}px`)
      if (coverShaped) coverShaped.style.setProperty('--shapedCoverTop', `${stopAt}px`)
    }

    let ticking = false
    const updateAll = () => {
      updateSide()
      updateCovers()
    }

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateAll()
          ticking = false
        })
        ticking = true
      }
    }

    const onResize = () => {
      measure()
      updateAll()
    }

    onResize()

    window.addEventListener('resize', onResize)
    scroller?.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('resize', onResize)
      scroller?.removeEventListener('scroll', onScroll)
    }
  }, [])

  const isHeroWrapperVisible = switchableRoles.some(role => role.type !== 'Student')
  const isFloatingTabsVisible = switchableRoles.length > 1 && preferredRoleType

  const userRow = me ? (
    <TeamUserCard
      userId={me.id}
      avatar={<Avatar userId={me.id} picture={me.profilePicture} fallbackType={'user'} size={'40px'} strokeColor={'grey'} />}
      firstName={me.meta.firstName}
      lastName={me.meta.lastName}
      nameTextStyle={'ALS'}
      nameSubtextStyle={'OS-10-400'}
      nameStyle={'normal'}
      roles={me.competencies}
    />
  ) : (
    <UserRowSkeleton />
  )

  return (
    <div className={styles.scrollContainer} ref={scrollRef}>
      <div className={clsx(styles.container, preferredRoleType && styles[preferredRoleType])}>
        <span className={clsx(styles.cover, styles.scrollable)} ref={coverRef} />
        <span className={clsx(styles.cover, styles.fixed)} ref={coverFixedRef} />
        <span className={clsx(styles.cover, styles.shaped)} ref={coverShapedRef} />
        <div className={styles.side} ref={sideRef}>
          <YourPointsWidget tpuPoints={0} disciplines={mockedData.closingDisciplines} />
        </div>

        <div className={styles.userRow} ref={userRowRef}>
          {userRow}
        </div>

        <h1 className={clsx(styles.title, 'ellipsis')}>С возвращением{me && `, ${me?.meta.firstName}`}!</h1>

        {isFloatingTabsVisible && (
          <FloatingTabs className={styles.switch} value={preferredRoleType} items={tabItems} onChange={setPreferredRoleType} />
        )}

        <div className={styles.hero} ref={heroRef}>
          <MyPlatformBanner>{isHeroWrapperVisible ? <StagesWidget /> : undefined}</MyPlatformBanner>
          {!isHeroWrapperVisible && <StagesWidget />}
        </div>

        <div className={styles.projects}>
          <MyPlatformProjectsWidgets />
        </div>
      </div>
    </div>
  )
}

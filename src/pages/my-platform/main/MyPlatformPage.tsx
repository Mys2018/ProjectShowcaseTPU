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
  useMyScores,
  usePreferencesStore,
  UserRowSkeleton,
  type UserSwitchableRole
} from '@/entities/user'
import {
  getStudentProjectHours,
  useParticipatingProjects,
  useProjectTimesheetSummary
} from '@/entities/project'
import {
  FloatingTabs,
  StagesWidget,
  YourPointsWidget,
  // YourTasksWidget,
  type ClosingDiscipline,
  type FloatingTabItem
} from '@/shared'
import { ComplaintBlock } from "@/shared/ui/complaint-block";

export function MyPlatformPage() {
  const { data: me } = useMe()
  const { preferredRoleType, setPreferredRoleType } = usePreferencesStore()

  const { data: scoresData } = useMyScores(Boolean(me?.id))
  const { data: participatingData } = useParticipatingProjects({ limit: 10 }, Boolean(me?.id))
  const activeProject = participatingData?.projects?.[0]
  const { data: timesheetSummary } = useProjectTimesheetSummary(activeProject?.id, Boolean(activeProject?.id))

  const activeProjectHours = getStudentProjectHours(timesheetSummary, me?.id)

  const disciplines: ClosingDiscipline[] = activeProject
    ? [
      {
        // title: activeProject.meta?.title || 'УИРС',
        title: 'УИРС',
        currentProgress: activeProjectHours,
        maxProgress: 36
      }
    ]
    : []

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
          <YourPointsWidget tpuPoints={scoresData?.totalScore ?? 0} disciplines={disciplines} />
          <ComplaintBlock onClick={() => { }} />
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

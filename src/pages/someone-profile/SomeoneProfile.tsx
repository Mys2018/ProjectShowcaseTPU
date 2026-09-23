import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from "react-router-dom";
import { useMediaQuery } from 'usehooks-ts'
import styles from './SomeoneProfile.module.css'
import { StudentParticipatingProjectCard } from "@/widgets/student-project-card";
import { MyCompetenciesList } from "@/features/my-competencies";
import { Portfolio } from "@/features/portfolio/Portfolio.tsx";
import { useMe, useUserById } from "@/entities/user";
import { useParticipatingProjects, useProjects, type ProjectCardData } from "@/entities/project";
import { CONTACTS_ANCHOR_ID, SomeoneProfileHeader } from "@/shared/ui/someone-profile-header/SomeoneProfileHeader.tsx";
import { FloatingPanel } from "@/shared/ui/floating-panel";
import { BackLink } from "@/shared/ui/back-link";
import { MOBILE_BREAKPOINT, useMobileChrome } from "@/shared/lib";
import { ProjectSkeleton, ROUTES } from "@/shared";

export function SomeoneProfile() {
  const params = useParams<{ id: string }>()
  const uid = Number(params.id)
  const isValidId = Boolean(uid) && !Number.isNaN(uid)
  const { data: user } = useUserById(uid)
  const { data: me } = useMe()
  const isMyProfile = Boolean(me?.id && Number(me.id) === uid)

  // Для своего профиля берём проекты участия из /me/projects/participating
  const { data: myParticipatingData, isLoading: isMyParticipatingLoading } = useParticipatingProjects(
    { limit: 100 },
    isMyProfile
  )

  // Для каталога берём проекты по фильтру участника роли (userId)
  const { data: catalogProjectsData, isLoading: isCatalogProjectsLoading } = useProjects(
    {
      offset: 0,
      limit: 100,
      userId: uid
    },
    isValidId
  )

  const projects = useMemo(() => {
    const list: ProjectCardData[] = []
    const seen = new Set<string>()

    const addProjects = (items?: ProjectCardData[]) => {
      if (!items) return
      for (const p of items) {
        if (!seen.has(p.id)) {
          // Убеждаемся, что студент участвует именно как участник роли
          const isParticipant =
            isMyProfile ||
            p.roles?.some((r) => r.placeUserIds?.includes(uid))

          if (isParticipant) {
            seen.add(p.id)
            list.push(p)
          }
        }
      }
    }

    if (isMyProfile) {
      addProjects(myParticipatingData?.projects)
    }
    addProjects(catalogProjectsData?.projects)

    return list
  }, [isMyProfile, myParticipatingData, catalogProjectsData, uid])

  const isProjectsLoading = isMyProfile
    ? isMyParticipatingLoading && projects.length === 0
    : isCatalogProjectsLoading && projects.length === 0

  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  const { panelTransform, panelAnimate, panelHidden } = useMobileChrome(isMobile)
  const [highlight, setHighlight] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Скроллим к контактам, только если блок не на виду. Если он и так примерно
  // по центру экрана — дёргать страницу не за чем, хватит подсветки.
  const showContacts = useCallback(() => {
    const el = document.getElementById(CONTACTS_ANCHOR_ID)
    if (!el) return
    const r = el.getBoundingClientRect()
    const comfortablyVisible = r.top >= window.innerHeight * 0.15 && r.bottom <= window.innerHeight * 0.85
    if (!comfortablyVisible) el.scrollIntoView({ behavior: 'smooth', block: 'center' })

    if (timer.current) clearTimeout(timer.current)
    setHighlight(true)
    timer.current = setTimeout(() => setHighlight(false), 700)
  }, [])

  // Уйти со страницы можно и во время подсветки — таймер надо снять,
  // иначе он сработает на размонтированном компоненте.
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  if (!user) {
    return null;
  }

  return (
    <div className={styles.mainContent}>
      <BackLink fallback={ROUTES.PROJECTS.RECRUITMENT} className={styles.headerLeft} />

      <section className={styles.title}>
        Профиль студентика
      </section>

      {/*<section className={styles.see}>*/}
      {/*  <PopupMenu*/}
      {/*    trigger={<button*/}
      {/*      type="button"*/}
      {/*      className={styles.moreMenuButton}*/}
      {/*    >*/}
      {/*      <MoreIcon />*/}
      {/*    </button>}*/}
      {/*  >*/}
      {/*    <PopupMenu.Row onClick={() => { }} title={'Сообщить о нарушении'}>*/}
      {/*      <FlagIcon />*/}
      {/*    </PopupMenu.Row>*/}
      {/*  </PopupMenu>*/}
      {/*</section>*/}

      <section className={styles.profile}>
        <SomeoneProfileHeader user={user} links={user.meta.messengers} highlight={highlight} />
        <div className={styles.body}>
          {isProjectsLoading ? (
            <div className={styles.projectsSection}>
              <h3 className={styles.projectsTitle}>Проекты</h3>
              <div className={styles.list}>
                <ProjectSkeleton />
                <ProjectSkeleton />
              </div>
            </div>
          ) : projects.length > 0 ? (
            <div className={styles.projectsSection}>
              <h3 className={styles.projectsTitle}>
                {projects.length > 1 ? 'Проекты' : 'Проект'}
              </h3>
              <div className={styles.list}>
                {projects.map((project) => (
                  <StudentParticipatingProjectCard key={project.id} project={project} studentId={uid} />
                ))}
              </div>
            </div>
          ) : null}
          {user.meta.skills && <MyCompetenciesList savedSkills={user.meta.skills} readonly={true} />}
          <Portfolio firstValue={user.meta.portfolioLink || ''} readonly={true} />
        </div>
      </section>

      {isMobile && (
        <FloatingPanel transform={panelTransform} animate={panelAnimate} hidden={panelHidden}>
          <FloatingPanel.Back fallback={ROUTES.PROJECTS.RECRUITMENT} />
          <FloatingPanel.Action tone="violet" onClick={showContacts}>
            Связаться
          </FloatingPanel.Action>
          {/* TODO: navigator.share — подключить вместе с остальными страницами */}
          <FloatingPanel.Share />
        </FloatingPanel>
      )}
    </div>
  );
}

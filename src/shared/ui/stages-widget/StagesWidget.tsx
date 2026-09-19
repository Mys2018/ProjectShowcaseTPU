/* eslint-disable fsd/forbidden-imports */
import clsx from 'clsx'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueries } from '@tanstack/react-query'
import styles from './StagesWidget.module.css'
import { ChevronRightIcon, FeedbackIcon, FolderIcon, LikeIcon } from '..'
import { assertNever } from '../../lib'
import { ROUTES } from '../../config'
import { usePreferencesStore, type UserSwitchableRole } from '@/entities/user'
import {
  useParticipatingProjects,
  useLikedProjects,
  useManagedProjects,
  useProjects,
  hasFreePlaces
} from '@/entities/project'
import {
  useApplications,
  getApplications,
  applicationKeys
} from '@/entities/application'

interface StagesData {
  type: 'projects' | 'feedback' | 'likes' | 'moderator-projects' | 'moderator-requests' | 'curator-projects' | 'curator-requests'
  count: number
  snippet?: string
  notification?: boolean
}

interface StagesCounts {
  participating: number
  participatingSnippet: string
  studentApplications: number
  studentApplicationsSnippet: string
  liked: number
  likedSnippet: string
  managed: number
  managedSnippet: string
  curatorApplications: number
  curatorApplicationsSnippet: string
  pending: number
  moderatorSnippet: string
}

const pluralizeWord = (count: number, one: string, few: string, many: string): string => {
  const mod10 = count % 10
  const mod100 = count % 100

  if (mod100 >= 11 && mod100 <= 19) {
    return many
  }
  if (mod10 === 1) {
    return one
  }
  if (mod10 >= 2 && mod10 <= 4) {
    return few
  }
  return many
}

const getStagesData = (roleType: UserSwitchableRole['type'], counts: StagesCounts): StagesData[] => {
  switch (roleType) {
    case 'Student':
      return [
        {
          type: 'projects',
          count: counts.participating,
          snippet: counts.participatingSnippet
        },
        {
          type: 'feedback',
          count: counts.studentApplications,
          snippet: counts.studentApplicationsSnippet
        },
        {
          type: 'likes',
          count: counts.liked,
          snippet: counts.likedSnippet
        }
      ]
    case 'Curator':
      return [
        {
          type: 'curator-projects',
          count: counts.managed,
          snippet: counts.managedSnippet
        },
        {
          type: 'curator-requests',
          count: counts.curatorApplications,
          snippet: counts.curatorApplicationsSnippet
        }
      ]
    case 'Moderator':
      return [
        {
          type: 'moderator-projects',
          count: counts.pending,
          snippet: counts.moderatorSnippet
        },
        {
          type: 'moderator-requests',
          count: counts.pending,
          snippet: counts.moderatorSnippet
        }
      ]
    default:
      return []
  }
}

const getName = (type: StagesData['type']) => {
  switch (type) {
    case 'projects':
      return 'Мои проекты'
    case 'feedback':
      return 'Мои отклики'
    case 'likes':
      return 'Понравились'
    case 'moderator-projects':
      return 'Модерация проектов'
    case 'moderator-requests':
      return 'Входящие жалобы'
    case 'curator-projects':
      return 'Управление проектами'
    case 'curator-requests':
      return 'Входящие заявки'
    default:
      assertNever(type)
  }
}

const getIcon = (type: StagesData['type']) => {
  switch (type) {
    case 'projects':
      return <FolderIcon className={styles.icon} />
    case 'feedback':
      return <FeedbackIcon className={styles.icon} />
    case 'likes':
      return <LikeIcon className={styles.icon} />
    case 'moderator-projects':
      return <FolderIcon className={styles.icon} />
    case 'moderator-requests':
      return <FolderIcon className={styles.icon} />
    case 'curator-projects':
      return <FolderIcon className={styles.icon} />
    case 'curator-requests':
      return <FolderIcon className={styles.icon} />
    default:
      assertNever(type)
      return null
  }
} // TODO заменить иконки

const getLink = (type: StagesData['type']) => {
  switch (type) {
    case 'projects':
      return ROUTES.ACTIVITY.MY_PROJECTS
    case 'feedback':
      return ROUTES.ACTIVITY.MY_APPLICATIONS
    case 'likes':
      return ROUTES.ACTIVITY.FAVORITES
    case 'moderator-projects':
      return ROUTES.MODERATION.PROJECTS
    case 'moderator-requests':
      return ROUTES.MODERATION.COMPLAINTS
    case 'curator-projects':
      return ROUTES.MANAGE.PROJECTS
    case 'curator-requests':
      return ROUTES.MANAGE.TEAMS
    default:
      assertNever(type)
      return ROUTES.MAIN
  }
}

export const StagesWidget = () => {
  const navigate = useNavigate()
  const { preferredRoleType: roleType } = usePreferencesStore()

  const isStudent = roleType === 'Student'
  const isCurator = roleType === 'Curator'
  const isModerator = roleType === 'Moderator'

  const { data: participatingData } = useParticipatingProjects(
    { limit: 100 },
    isStudent
  )
  const { data: applicationsData } = useApplications(
    { mode: 'AsStudent', offset: 0, limit: 100 },
    isStudent
  )
  const { data: likedData } = useLikedProjects(
    {},
    isStudent
  )

  const { data: managedData } = useManagedProjects(
    { limit: 100 },
    isCurator
  )

  const managedProjectsList = useMemo(
    () => (isCurator ? managedData?.projects ?? [] : []),
    [isCurator, managedData?.projects]
  )

  const applicationQueries = useQueries({
    queries: managedProjectsList.map(project => ({
      queryKey: applicationKeys.list({ mode: 'AsOwner', projectId: project.id, offset: 0, limit: 100 }),
      queryFn: () => getApplications({ mode: 'AsOwner', projectId: project.id, offset: 0, limit: 100 }),
      enabled: isCurator && !!project.id
    }))
  })

  const { data: pendingProjectsData } = useProjects(
    { status: ['Pending'], limit: 1 },
    isModerator
  )

  if (!roleType) return null

  // Student metrics & snippets
  const participatingCount = participatingData?.total ?? participatingData?.projects?.length ?? 0
  const participatingProjects = participatingData?.projects ?? []
  const activeParticipatingCount = participatingProjects.filter(
    p => p.status === 'InProgress' || p.status === 'Recruiting' || p.status === 'RecruitmentCompleted' || (p.status as string) === 'Active'
  ).length

  let participatingSnippet: string
  if (participatingCount === 0) {
    participatingSnippet = 'нет завершённых'
  } else if (activeParticipatingCount > 0) {
    participatingSnippet = `${activeParticipatingCount} ${pluralizeWord(activeParticipatingCount, 'активный', 'активных', 'активных')}`
  } else {
    participatingSnippet = 'все завершены'
  }

  const activeStudentApplications = (applicationsData?.applications ?? []).filter(
    app => app.status === 'pending'
  )
  const studentApplicationsCount = activeStudentApplications.length
  let studentApplicationsSnippet: string
  if (studentApplicationsCount === 0) {
    studentApplicationsSnippet = 'нет оставленных'
  } else if (studentApplicationsCount >= 5) {
    studentApplicationsSnippet = 'достигнут лимит'
  } else {
    const remaining = 5 - studentApplicationsCount
    studentApplicationsSnippet = `ещё ${remaining} ${remaining === 1 ? 'доступен' : 'доступно'}`
  }

  const likedCount = likedData?.total ?? likedData?.projects?.length ?? 0
  const likedProjects = likedData?.projects ?? []
  const actualLikedCount = likedProjects.filter(
    p => (p.status === 'Recruiting' || p.status === 'InProgress' || (p.status as string) === 'Active') && hasFreePlaces(p)
  ).length

  let likedSnippet: string
  if (likedCount === 0) {
    likedSnippet = 'нет отмеченных'
  } else if (actualLikedCount === 0) {
    likedSnippet = 'нет актуальных'
  } else {
    likedSnippet = `${actualLikedCount} ${pluralizeWord(actualLikedCount, 'актуален', 'актуальны', 'актуальных')}`
  }

  // Curator metrics & snippets
  const managedCount = managedData?.total ?? managedData?.projects?.length ?? 0
  const recruitingManagedCount = managedProjectsList.filter(
    p => p.status === 'Recruiting' || (p.status === 'RecruitmentCompleted' && hasFreePlaces(p))
  ).length
  const inProgressManagedCount = managedProjectsList.filter(
    p => p.status === 'InProgress' || (p.status === 'RecruitmentCompleted' && !hasFreePlaces(p))
  ).length
  const pendingManagedCount = managedProjectsList.filter(
    p => p.status === 'Pending' || p.status === 'NeedsRework'
  ).length

  let managedSnippet: string
  if (managedCount === 0) {
    managedSnippet = 'нет созданных'
  } else if (recruitingManagedCount > 0 || inProgressManagedCount > 0) {
    const parts: string[] = []
    if (recruitingManagedCount > 0) parts.push(`${recruitingManagedCount} в наборе`)
    if (inProgressManagedCount > 0) parts.push(`${inProgressManagedCount} в работе`)
    managedSnippet = parts.join(', ')
  } else if (pendingManagedCount > 0) {
    managedSnippet = 'ожидают модерации'
  } else {
    managedSnippet = 'все завершены'
  }

  const curatorApplicationsCount = applicationQueries.reduce((sum, query) => {
    const activeApps = (query.data?.applications ?? []).filter(
      app => app.status === 'pending'
    )
    return sum + activeApps.length
  }, 0)
  const curatorApplicationsSnippet = curatorApplicationsCount === 0 ? 'нет заявок' : 'ждут рассмотрения'

  // Moderator metrics & snippets
  const pendingCount = pendingProjectsData?.total ?? pendingProjectsData?.projects?.length ?? 0
  const moderatorSnippet = pendingCount === 0 ? 'все проверены' : 'ожидают проверки'

  const stagesData = getStagesData(roleType, {
    participating: participatingCount,
    participatingSnippet,
    studentApplications: studentApplicationsCount,
    studentApplicationsSnippet,
    liked: likedCount,
    likedSnippet,
    managed: managedCount,
    managedSnippet,
    curatorApplications: curatorApplicationsCount,
    curatorApplicationsSnippet,
    pending: pendingCount,
    moderatorSnippet
  })

  return (
    <div className={styles.mainContainer}>
      {stagesData.map(card => (
        <div key={card.type} className={styles.cardBody} onClick={() => void navigate(getLink(card.type))}>
          <header className={styles.cardHeader}>
            <span className={styles.count}>{card.count}</span>
            {getIcon(card.type)}
          </header>
          <footer className={styles.cardFooter}>
            <h4 className={clsx(styles.label, card.notification && styles.notification)}>{getName(card.type)}</h4>
            <div className={styles.wrapper}>
              <p className={styles.snippet}>{card.snippet}</p>
              <ChevronRightIcon className={styles.arrowIcon} />
            </div>
          </footer>
        </div>
      ))}
    </div>
  )
}

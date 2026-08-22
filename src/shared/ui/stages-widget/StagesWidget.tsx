import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'
import styles from './StagesWidget.module.css'
import { ChevronRightIcon, FeedbackIcon, FolderIcon, LikeIcon } from '..'
import { assertNever } from '../../lib'
import { ROUTES } from '../../config'
import { usePreferencesStore, type UserRole } from '@/entities/user'

interface StagesData {
  type: 'projects' | 'feedback' | 'likes' | 'moderator-projects' | 'moderator-requests' | 'curator-projects' | 'curator-requests'
  count: number
  snippet?: string
  notification?: boolean
}

const getStagesData = (roleType: UserRole['type']): StagesData[] => {
  switch (roleType) {
    case 'Student':
      return [
        {
          type: 'projects',
          count: 2,
          snippet: '1 активный'
        },
        {
          type: 'feedback',
          count: 1,
          snippet: 'еще 4 доступно'
        },
        {
          type: 'likes',
          count: 3,
          snippet: 'ждут отклика'
        }
      ]
    case 'Curator':
      return [
        {
          type: 'curator-projects',
          count: 1,
          snippet: 'все завершены'
        },
        {
          type: 'curator-requests',
          count: 2,
          snippet: 'еще 3 доступно'
        }
      ]
    case 'Moderator':
      return [
        {
          type: 'moderator-projects',
          count: 1,
          snippet: 'все завершены'
        },
        {
          type: 'moderator-requests',
          count: 2,
          snippet: 'еще 3 доступно'
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
      return 'Заявки на модерацию'
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
      return ROUTES.MY_PLATFORM.ACTIVITIES.STUDENT.PROJECTS
    case 'feedback':
      return ROUTES.MY_PLATFORM.ACTIVITIES.STUDENT.APPLICATIONS
    case 'likes':
      return ROUTES.MY_PLATFORM.ACTIVITIES.STUDENT.LIKES
    case 'moderator-projects':
      return ROUTES.MY_PLATFORM.ACTIVITIES.MODERATOR.PROJECTS
    case 'moderator-requests':
      return ROUTES.MY_PLATFORM.ACTIVITIES.MODERATOR.APPLICATIONS
    case 'curator-projects':
      return ROUTES.MY_PLATFORM.ACTIVITIES.CURATOR.PROJECTS
    case 'curator-requests':
      return ROUTES.MY_PLATFORM.ACTIVITIES.CURATOR.APPLICATIONS
    default:
      assertNever(type)
      return ROUTES.MY_PLATFORM.BASE
  }
}

export const StagesWidget = () => {
  const navigate = useNavigate()
  const { preferredRoleType: roleType } = usePreferencesStore()

  const stagesData = getStagesData(roleType)

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

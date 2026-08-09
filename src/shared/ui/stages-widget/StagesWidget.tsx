import { useNavigate } from 'react-router-dom'
import FeedBackIcon from '@/shared/ui/icons/feedback.svg?react'
import FolderIcon from '@/shared/ui/icons/folder.svg?react'
import LikeIcon from '@/shared/ui/icons/like.svg?react'
import styles from './StagesWidget.module.css'
import { assertNever } from '@/shared/lib'
import { usePreferencesStore, type UserRole } from '@/entities/user'

interface StagesData {
  type: 'projects' | 'feedback' | 'likes' | 'moderator-projects' | 'moderator-requests' | 'curator-projects' | 'curator-requests'
  count: number
  snippet?: string
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
      return <FolderIcon className={styles.folderIcon} />
    case 'feedback':
      return <FeedBackIcon className={styles.feedbackIcon} />
    case 'likes':
      return <LikeIcon className={styles.likeIcon} />
    case 'moderator-projects':
      return <FolderIcon className={styles.folderIcon} />
    case 'moderator-requests':
      return <FolderIcon className={styles.folderIcon} />
    case 'curator-projects':
      return <FolderIcon className={styles.folderIcon} />
    case 'curator-requests':
      return <FolderIcon className={styles.folderIcon} /> // todo заменить
    default:
      assertNever(type)
      return null
  }
}

export const StagesWidget = () => {
  const navigate = useNavigate()
  const { preferredRoleType: roleType } = usePreferencesStore()

  const stagesData = getStagesData(roleType)

  return (
    <div className={styles.mainContainer}>
      {stagesData.map(card => (
        <div key={card.type} className={styles.cardBody} onClick={() => navigate('/my-platform/create')}>
          <header className={styles.cardHeader}>
            <span className={styles.count}>{card.count}</span>
            {getIcon(card.type)}
          </header>
          <footer className={styles.cardFooter}>
            <h4 className={styles.label}>{getName(card.type)}</h4>
            <p className={styles.snippet}>{card.snippet}</p>
          </footer>
        </div>
      ))}
    </div>
  )
}

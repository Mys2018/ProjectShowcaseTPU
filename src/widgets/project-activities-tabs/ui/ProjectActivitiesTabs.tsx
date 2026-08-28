import { useLocation, useNavigate } from 'react-router-dom'
import { usePreferencesStore } from '@/entities/user'
import { assertNever, HorizontalTabs, ROUTES, type HorizontalTabItem } from '@/shared'

interface ProjectActivitiesTabsProps {
  className?: string
}

export function ProjectActivitiesTabs({ className }: ProjectActivitiesTabsProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const { preferredRoleType } = usePreferencesStore()
  const getTabItems: () => HorizontalTabItem<string>[] = () => {
    switch (preferredRoleType) {
      case 'Student':
        return [
          { label: 'Мои проекты', value: ROUTES.MY_PLATFORM.ACTIVITIES.STUDENT.PROJECTS },
          { label: 'Отклики', value: ROUTES.MY_PLATFORM.ACTIVITIES.STUDENT.APPLICATIONS },
          { label: 'Понравились', value: ROUTES.MY_PLATFORM.ACTIVITIES.STUDENT.LIKES }
        ]
      case 'Curator':
        return [
          { label: 'Управление проектами', value: ROUTES.MY_PLATFORM.ACTIVITIES.CURATOR.PROJECTS },
          { label: 'Входящие заявки', value: ROUTES.MY_PLATFORM.ACTIVITIES.CURATOR.APPLICATIONS }
        ]
      case 'Moderator':
        return [
          { label: 'Модерация проектов', value: ROUTES.MY_PLATFORM.ACTIVITIES.MODERATOR.PROJECTS },
          { label: 'Заявки на модерацию', value: ROUTES.MY_PLATFORM.ACTIVITIES.MODERATOR.APPLICATIONS }
        ]
      case null:
        return []
      default:
        assertNever(preferredRoleType)
        return []
    }
  }

  return <HorizontalTabs className={className} items={getTabItems()} value={location.pathname} onChange={value => void navigate(value)} />
}

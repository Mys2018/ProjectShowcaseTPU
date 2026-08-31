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
          { label: 'Мои проекты', value: ROUTES.ACTIVITY.MY_PROJECTS },
          { label: 'Мои отклики', value: ROUTES.ACTIVITY.MY_APPLICATIONS },
          { label: 'Понравившиеся', value: ROUTES.ACTIVITY.FAVORITES }
        ]
      case 'Curator':
        return [
          { label: 'Все проекты', value: ROUTES.MANAGE.PROJECTS },
          { label: 'Отклики и команда', value: ROUTES.MANAGE.TEAMS },
          { label: 'Оценка участников', value: ROUTES.MANAGE.GRADES }
        ]
      case 'Moderator':
        return [
          { label: 'Модерация проектов', value: ROUTES.MODERATION.PROJECTS },
          { label: 'Входящие жалобы', value: ROUTES.MODERATION.COMPLAINTS }
        ]
      case null:
        return []
      default:
        assertNever(preferredRoleType)
        return []
    }
  }

  const currentValue = location.pathname + location.hash

  return <HorizontalTabs className={className} items={getTabItems()} value={currentValue} onChange={value => void navigate(value, { replace: true })} />
}

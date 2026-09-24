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

  const roleType = ((): 'Curator' | 'Moderator' | 'Student' | null => {
    if (location.pathname.startsWith(ROUTES.MANAGE.BASE)) return 'Curator'
    if (location.pathname.startsWith(ROUTES.MODERATION.BASE)) return 'Moderator'
    if (location.pathname.startsWith(ROUTES.ACTIVITY.BASE)) return 'Student'
    return preferredRoleType
  })()

  const getTabItems: () => HorizontalTabItem<string>[] = () => {
    switch (roleType) {
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
        // Жалобы пока не реализованы — вкладку не показываем.
        return [
          { label: 'Модерация проектов', value: ROUTES.MODERATION.PROJECTS }
        ]
      case null:
        return []
      default:
        assertNever(roleType)
        return []
    }
  }

  const currentValue = (() => {
    if (!location.hash) {
      if (location.pathname === ROUTES.MANAGE.BASE) return ROUTES.MANAGE.PROJECTS
      if (location.pathname === ROUTES.ACTIVITY.BASE) return ROUTES.ACTIVITY.MY_PROJECTS
      if (location.pathname === ROUTES.MODERATION.BASE) return ROUTES.MODERATION.PROJECTS
    }
    return location.pathname + location.hash
  })()

  return <HorizontalTabs className={className} items={getTabItems()} value={currentValue} onChange={value => void navigate(value, { replace: true })} />
}

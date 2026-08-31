import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './ProjectActivitiesLayout.module.css'
import { ProjectActivitiesTabs } from '@/widgets/project-activities-tabs'
import { BackArrowIcon, ROUTES, usePageTitle } from '@/shared'

export function ProjectActivitiesLayout() {
  usePageTitle('проектной деятельности')
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!location.hash) {
      if (location.pathname === ROUTES.ACTIVITY.BASE) {
        navigate(ROUTES.ACTIVITY.MY_PROJECTS, { replace: true })
      } else if (location.pathname === ROUTES.MANAGE.BASE) {
        navigate(ROUTES.MANAGE.PROJECTS, { replace: true })
      } else if (location.pathname === ROUTES.MODERATION.BASE) {
        navigate(ROUTES.MODERATION.PROJECTS, { replace: true })
      }
    }
  }, [location.pathname, location.hash, navigate])

  const renderContent = () => {
    // Временно заглушка. Сюда нужно вставлять компоненты в зависимости от хэша.
    // if (location.hash === '#my-projects') return ...
    return (
      <div>
        {location.hash}
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.back} onClick={() => void navigate(ROUTES.MAIN)}>
        <BackArrowIcon className={styles.icon} />
        <p>Вернуться к Моей платформе</p>
      </div>
      <h1 className={styles.title}>Проектная деятельность</h1>
      <ProjectActivitiesTabs className={styles.tabs} />
      {renderContent()}
    </div>
  )
}

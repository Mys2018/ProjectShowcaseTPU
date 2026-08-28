import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import styles from './ProjectActivitiesLayout.module.css'
import { ProjectActivitiesTabs } from '@/widgets/project-activities-tabs'
import { usePreferencesStore } from '@/entities/user'
import { assertNever, BackArrowIcon, ROUTES } from '@/shared'

export function ProjectActivitiesLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const { preferredRoleType } = usePreferencesStore()
  useEffect(() => {
    if (location.pathname === ROUTES.MY_PLATFORM.ACTIVITIES.BASE) {
      switch (preferredRoleType) {
        case 'Student': {
          navigate(ROUTES.MY_PLATFORM.ACTIVITIES.STUDENT.PROJECTS, { replace: true })
          break
        }
        case 'Curator': {
          navigate(ROUTES.MY_PLATFORM.ACTIVITIES.CURATOR.PROJECTS, { replace: true })
          break
        }
        case 'Moderator': {
          navigate(ROUTES.MY_PLATFORM.ACTIVITIES.MODERATOR.PROJECTS, { replace: true })
          break
        }
        case null:
          break
        default:
          assertNever(preferredRoleType)
      }
    }
  }, [location.pathname, preferredRoleType, navigate])

  return (
    <div className={styles.container}>
      <div className={styles.back} onClick={() => void navigate(-1)}>
        <BackArrowIcon className={styles.icon} />
        <p>Вернуться к Моей платформе</p>
      </div>
      <h1 className={styles.title}>Проектная деятельность</h1>
      <ProjectActivitiesTabs className={styles.tabs} />
      <Outlet />
    </div>
  )
}

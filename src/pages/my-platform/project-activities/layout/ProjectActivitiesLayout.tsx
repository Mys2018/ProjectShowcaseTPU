import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './ProjectActivitiesLayout.module.css'
import { LikedProjectsPage } from '../liked-projects/LikedProjectsPage'
import { MyApplicationsPage } from '../my-applications/ui/MyApplicationsPage'
import { ParticipatingProjectsPage } from '../participating-projects/ParticipatingProjectsPage'
import { AllCuratingProjects } from '../all-curating-projects/AllCuratingProjects'
import { ApplicationsAndTeam } from '../applications-and-team/ApplicationsAndTeam'
import { ParticipantsGrading } from '../participants-grading/ParticipantsGrading'
import { ProjectModerationPage } from '../project-moderation/ProjectModerationPage'
import { ProjectActivitiesTabs } from '@/widgets/project-activities-tabs'
import { BackLink } from '@/shared/ui/back-link'
import { ROUTES } from '@/shared'

export function ProjectActivitiesLayout() {
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
    const fullLocation = location.pathname + location.hash
    switch (fullLocation) {
      case ROUTES.ACTIVITY.FAVORITES:
        return <LikedProjectsPage />
      case ROUTES.ACTIVITY.MY_APPLICATIONS:
        return <MyApplicationsPage />
      case ROUTES.ACTIVITY.BASE:
      case ROUTES.ACTIVITY.MY_PROJECTS:
        return <ParticipatingProjectsPage />
      case ROUTES.MANAGE.BASE:
      case ROUTES.MANAGE.PROJECTS:
        return <AllCuratingProjects />
      case ROUTES.MANAGE.TEAMS:
        return <ApplicationsAndTeam />
      case ROUTES.MANAGE.GRADES:
        return <ParticipantsGrading />
      case ROUTES.MODERATION.BASE:
      case ROUTES.MODERATION.PROJECTS:
        return <ProjectModerationPage />
      case ROUTES.MODERATION.COMPLAINTS:
        // Жалобы пока не реализованы — уводим на модерацию проектов.
        navigate(ROUTES.MODERATION.PROJECTS, { replace: true })
        return <ProjectModerationPage />
      default:
        return location.hash
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <BackLink fallback={ROUTES.MAIN} className={styles.back} />
        <h1 className={styles.title}>Проектная деятельность</h1>

        <div className={styles.tabsContainer}>
          <ProjectActivitiesTabs className={styles.tabs} />
        </div>
        {renderContent()}
      </div>
    </div>
  )
}

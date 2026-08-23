import { Outlet, useNavigate } from 'react-router-dom'
import styles from './ProjectActivitiesLayout.module.css'
import { ProjectActivitiesTabs } from '@/widgets/project-activities-tabs'
import { BackArrowIcon } from '@/shared'

export function ProjectActivitiesLayout() {
  const navigate = useNavigate()
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

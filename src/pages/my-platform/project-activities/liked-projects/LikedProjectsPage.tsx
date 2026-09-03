import styles from './LikedProjectsPage.module.css'
import { ProjectsGrid } from '@/widgets/projects-grid'

export function LikedProjectsPage() {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Понравившиеся проекты</h3>
      <ProjectsGrid type='liked' />
    </div>
  )
}

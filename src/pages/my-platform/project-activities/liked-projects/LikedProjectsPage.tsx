import styles from './LikedProjectsPage.module.css'
import { ProjectsGrid } from '@/widgets/projects-grid'
import { NoProjectsFallback } from '@/entities/project'

export function LikedProjectsPage() {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Понравившиеся проекты</h3>
      <ProjectsGrid
        type='liked'
        emptyFallback={
          <NoProjectsFallback
            title='Понравившихся проектов пока нет'
            description='Переходите в каталог проектов, выбирайте интересующие и успевайте подать заявки до конца набора!'
          />
        }
      />
    </div>
  )
}

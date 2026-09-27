import styles from './LikedProjectsPage.module.css'
import { ProjectsGrid } from '@/widgets/projects-grid'
import { NoProjectsFallback } from '@/entities/project'
import MyLikes from '@/shared/assets/no_liked_projects.svg?react'
import {useNavigate} from "react-router-dom";
import {ROUTES} from "@/shared";

export function LikedProjectsPage() {

  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Понравившиеся проекты</h3>
      <ProjectsGrid
        type='liked'
        emptyFallback={
          <NoProjectsFallback
            title='Понравившихся проектов пока нет'
            description='Переходите в каталог проектов, выбирайте интересующие и успевайте подать заявки до конца набора!'
            image={<MyLikes/>}
            buttonType={'green'}
            buttonText={'Выбрать проект'}
            onClick={() => {
              navigate(ROUTES.PROJECTS.BASE)
            }}
          />
        }
      />
    </div>
  )
}

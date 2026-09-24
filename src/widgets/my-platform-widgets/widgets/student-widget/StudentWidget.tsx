import styles from './StudentWidget.module.css'
import { isActiveParticipatingProject, useParticipatingProjects } from "@/entities/project";
import {StudentParticipatingProjectCard} from "@/widgets/student-project-card";
import {ProjectsGrid} from "@/widgets/projects-grid";
import {GreyFilledButton, ROUTES} from "@/shared";
import {useNavigate} from "react-router-dom";
import { useMemo } from "react";

export const StudentWidget = () => {

  const { data: projects } = useParticipatingProjects()
  const navigate = useNavigate()

  // NotImplemented (и прочие терминальные) не показываем и не считаем «активными».
  const activeProjects = useMemo(
    () => (projects?.projects ?? []).filter(isActiveParticipatingProject),
    [projects]
  )

  return (
    <section className={styles.bodyContainer}>

      {
        activeProjects.length > 0 && <div className={styles.bigBlock}>
          <div className={styles.headerRow}>
            {
              activeProjects.length > 1
                ? <h3 className={styles.title}>Ваши активные проекты</h3>
                : <h3 className={styles.title}>Ваш активный проект</h3>
            }
          </div>
          {
            activeProjects.map((project) => (
              <StudentParticipatingProjectCard key={project.id} project={project}/>
            ))
          }
        </div>
      }

      <div className={styles.bigBlock}>
        <div className={styles.headerRow}>
          <h3 className={styles.lightTitle}>
            Другие проекты платформы
          </h3>
        </div>
        <div className={styles.projectsContainer}>
          <ProjectsGrid
            type={'recruiting'}
          />
          <GreyFilledButton
            buttonText={'Смотреть все проекты'}
            onClick={
              () => {
                navigate(ROUTES.PROJECTS.RECRUITMENT)
              }
            }
          />
        </div>

      </div>
    </section>
  )
}

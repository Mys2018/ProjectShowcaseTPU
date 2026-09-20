import type { ReactElement } from 'react'
import styles from './ProjectInfo.module.css'
import type { ProjectCardData } from '../../model/types'
import { ProjectMainInfo } from './main/ProjectMainInfo'
import { ProjectPrd } from './prd/ProjectPrd'
import { ProjectResources } from './resources/ProjectResources'
import { Section } from '@/shared'

interface ProjectInfoProps {
  project: ProjectCardData
  checkpointsSlot?: ReactElement
}

export function ProjectInfo({ project, checkpointsSlot }: ProjectInfoProps) {
  return (
    <div className={styles.container}>
      <ProjectMainInfo project={project} />
      <ProjectPrd prd={project.prdMeta} />
      <div className={styles.wrapper}>
        <h3 className={styles.title}>Даты и ресурсы</h3>
        <Section className={styles.datesAndResources}>
          {checkpointsSlot && (
            <div className={styles.checkpoints}>
              <h3 className={styles.heading}>Таймлайн (ключевые точки)</h3>
              {checkpointsSlot}
            </div>
          )}
          <ProjectResources project={project} />
        </Section>
      </div>
    </div>
  )
}

import type { ReactElement } from 'react'
import styles from './ProjectInfo.module.css'
import type { ProjectCardData } from '../../model/types'
import { ProjectMainInfo } from './main/ProjectMainInfo'
import { ProjectPrd } from './prd/ProjectPrd'
import { ProjectResources } from './resources/ProjectResources'
import { Section } from '@/shared'

interface ProjectInfoProps {
  project: ProjectCardData
  primaryTagSlot?: ReactElement
  tagsSlot?: ReactElement
  checkpointsSlot?: ReactElement
}

export function ProjectInfo({ project, primaryTagSlot, tagsSlot, checkpointsSlot }: ProjectInfoProps) {
  return (
    <div className={styles.container}>
      <ProjectMainInfo project={project} primaryTagSlot={primaryTagSlot} tagsSlot={tagsSlot} />
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

import clsx from 'clsx'
import type { MouseEventHandler, ReactElement } from 'react'
import styles from './ProjectCardVertical.module.css'
import type { ProjectCardData } from '../../model/types'
import { ProjectCardHeader } from '../project-card-header/ProjectCardHeader'
import { ProjectFormatBadge } from '../project-format-badge/ProjectFormatBadge'

interface ProjectCardVerticalProps {
  project: ProjectCardData
  small?: boolean
  headerSlot?: ReactElement
  bodySlot?: ReactElement
  footerSlot?: ReactElement
  className?: string
  onClick?: MouseEventHandler<HTMLDivElement>
}

export function ProjectCardVertical({ project, small, headerSlot, bodySlot, footerSlot, className, onClick }: ProjectCardVerticalProps) {
  const { primaryTag, type, id, meta } = project
  const { title } = meta

  return (
    <div className={clsx(styles.card, onClick && styles.clickable, className)} onClick={onClick}>
      <ProjectCardHeader className={styles.header} label={primaryTag.name}>
        {headerSlot}
      </ProjectCardHeader>
      <div className={clsx(styles.content, small && styles.small)}>
        <div className={styles.main}>
          {!small && (
            <div className={styles.short}>
              <ProjectFormatBadge format={type} />
              <div className={styles.id}>
                <span className={styles.label}>ID</span>
                <span className={`${styles.value} ellipsis`}>{id}</span>
              </div>
            </div>
          )}
          <h3 className={styles.title}>{title}</h3>
          {bodySlot}
        </div>
        {footerSlot}
      </div>
    </div>
  )
}

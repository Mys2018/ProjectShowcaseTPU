import clsx from 'clsx'
import type { MouseEventHandler, ReactElement } from 'react'
import styles from './ProjectCardHorizontal.module.css'
import { ProjectCardHeader } from '../project-card-header/ProjectCardHeader'
import { ProjectFormatBadge } from '../project-format-badge/ProjectFormatBadge'
import type { ProjectCardData } from '../../model/types'

interface ProjectCardHorizontalProps {
  project: ProjectCardData
  mainSlot?: ReactElement
  headerSlot?: ReactElement
  sideSlot?: ReactElement
  footerSlot?: ReactElement
  className?: string
  onClick?: MouseEventHandler<HTMLDivElement>
}

export function ProjectCardHorizontal({
  project,
  mainSlot,
  headerSlot,
  sideSlot,
  footerSlot,
  className,
  onClick
}: ProjectCardHorizontalProps) {
  const { primaryTag, type, id, meta } = project
  const { title } = meta

  return (
    <div className={clsx(styles.card, onClick && styles.clickable, className)} onClick={onClick}>
      <ProjectCardHeader className={styles.cover} label={primaryTag.name} rotated />
      <div className={styles.content}>
        <div className={styles.header}>
          {headerSlot}
        </div>
        <div className={styles.main}>
          <div className={styles.info}>
            <div className={styles.short}>
              <ProjectFormatBadge format={type} />
              <div className={styles.id}>
                <span className={styles.label}>ID</span>
                <span className={`${styles.value} ellipsis`}>{id}</span>
              </div>
            </div>
            <div className={styles.meta}>
              <h3 className={styles.title}>{title}</h3>
              {mainSlot}
            </div>
          </div>
          {sideSlot}
        </div>
        {footerSlot && <div className={styles.footer}>{footerSlot}</div>}
      </div>
    </div>
  )
}

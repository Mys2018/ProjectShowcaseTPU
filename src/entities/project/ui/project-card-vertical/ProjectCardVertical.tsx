import styles from './ProjectCardVertical.module.css'
import type { MouseEventHandler, ReactElement } from 'react'
import type { ProjectCardData } from '../../model/types'
import clsx from 'clsx'
import { ProjectCardHeader } from '../project-card-header/ProjectCardHeader'
import { getSortedTags } from '../../lib/tags'
import { ProjectTags } from '../project-tags/ProjectTags'
import { ProjectFormatBadge } from '../project-format-badge/ProjectFormatBadge'
import { ProjectCompetencies } from '../project-competencies/ProjectCompetencies'

interface ProjectCardVerticalProps {
  project: ProjectCardData
  small?: boolean
  headerSlot?: ReactElement
  footerSlot?: ReactElement
  className?: string
  onClick?: MouseEventHandler<HTMLDivElement>
}

export function ProjectCardVertical({ project, small, headerSlot, footerSlot, className, onClick }: ProjectCardVerticalProps) {
  const { primaryTag, tags, type, id, meta, roles } = project
  const { title } = meta
  const sortedTags = getSortedTags(tags, primaryTag)

  return (
    <div className={clsx(styles.card, onClick && styles.clickable, className)} onClick={onClick}>
      <ProjectCardHeader className={styles.header} label={primaryTag.tagName}>
        {!small && <ProjectTags tags={sortedTags} visibleCount={1} />}
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
          {!small && (
            <div>
              <ProjectCompetencies competencies={roles} rowDirection />
              {footerSlot && <span className={styles.divider} />}
            </div>
          )}
        </div>
        {footerSlot && <div className={styles.footer}>{footerSlot}</div>}
      </div>
    </div>
  )
}

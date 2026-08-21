import clsx from 'clsx'
import { useEffect, useRef } from 'react'
import styles from './ProjectCompetencies.module.css'
import type { ProjectCardData } from '../../model/types'
import { getCompetencyPlural } from '../../lib/plurals'
import { updateScrollFade } from '@/shared'

interface ProjectCompetenciesProps {
  competencies: ProjectCardData['roles']
  rowDirection?: boolean
  className?: string
}

export function ProjectCompetencies({ competencies, rowDirection = false, className }: ProjectCompetenciesProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const list = listRef.current
    const wrapper = wrapperRef.current
    if (!list || !wrapper) return

    const handler = () => updateScrollFade(wrapper, list, rowDirection)
    const ro = new ResizeObserver(handler)

    handler()
    list.addEventListener('scroll', handler)
    ro.observe(list)

    return () => {
      list.removeEventListener('scroll', handler)
      ro.disconnect()
    }
  }, [rowDirection])

  return (
    <div className={clsx(styles.competencies, className)}>
      <div className={styles.label}>{getCompetencyPlural(competencies.length)}</div>
      <div className={clsx(styles.wrapper, rowDirection && styles.row)} ref={wrapperRef}>
        <div className={styles.list} ref={listRef}>
          {competencies.map(competency => (
            <span key={competency.roleId} className={styles.competency}>
              {competency.meta.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

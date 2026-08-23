import clsx from 'clsx'
import { useEffect, useRef } from 'react'
import styles from './CompetencyBadgeList.module.css'
import { CompetencyBadge } from '..'
import type { Competency } from '../../model/types'
import { getCompetencyPlural } from '../../lib/plurals'
import { updateScrollFade } from '@/shared'

interface CompetencyBadgeListProps {
  competencies: Competency[]
  row?: boolean
  className?: string
}

export function CompetencyBadgeList({ competencies, row, className }: CompetencyBadgeListProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const list = listRef.current
    const wrapper = wrapperRef.current
    if (!list || !wrapper) return

    const handler = () => updateScrollFade(wrapper, list, row)
    const ro = new ResizeObserver(handler)

    handler()
    list.addEventListener('scroll', handler)
    ro.observe(list)

    return () => {
      list.removeEventListener('scroll', handler)
      ro.disconnect()
    }
  }, [row])

  return (
    <div className={clsx(styles.competencies, className)}>
      <div className={styles.label}>{getCompetencyPlural(competencies.length)}</div>
      <div className={clsx(styles.wrapper, row && styles.row)} ref={wrapperRef}>
        <div className={styles.list} ref={listRef}>
          {competencies.map(competency => (
            <CompetencyBadge key={competency.id} competency={competency} />
          ))}
        </div>
      </div>
    </div>
  )
}

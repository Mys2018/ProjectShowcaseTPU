import styles from './CompetencyBadge.module.css'
import type { Competency } from '../../model/types'
import clsx from 'clsx'
import CheckIcon from '@/shared/ui/icons/check.svg?react'

interface CompetencyBadgeProps {
  competency: Competency
  className?: string
}

export function CompetencyBadge({ competency, className }: CompetencyBadgeProps) {
  const relevance = competency.relevance
  let check = false

  let relevanceClass: string | undefined
  if (relevance !== undefined && relevance !== null) {
    if (relevance >= 0.8 && relevance <= 1) {
      relevanceClass = styles.relevanceHigh
      check = true
    } else if (relevance >= 0.5 && relevance < 0.8) {
      relevanceClass = styles.relevanceMedium
    }
  }

  return <div
    className={clsx(styles.competency, relevanceClass, className)}> {check && <CheckIcon/>} {competency.name}</div>
}

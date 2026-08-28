import type { Competency } from '../model/types'
import QAIcon from '../assets/qa-engineer.svg?react'
import FallbackIcon from '../assets/fallback.svg?react'

interface CompetencyIconProps {
  competency: Competency
  className?: string
}

export function CompetencyIcon({ competency, className = '' }: CompetencyIconProps) {
  let Icon = FallbackIcon
  switch (competency.name) {
    case 'Тестировка': {
      Icon = QAIcon
      break
    }
  }
  return <Icon className={className} />
}

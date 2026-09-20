import type { Competency } from '../model/types'
import QAIcon from '../assets/qa.svg?react'
import AIIcon from '../assets/ai.svg?react'
import DevIcon from '../assets/dev.svg?react'
import DesignIcon from '../assets/design.svg?react'
import FallbackIcon from '../assets/fallback.svg?react'

interface CompetencyIconProps {
  competency: Competency
  className?: string
}

export function CompetencyIcon({ competency, className = '' }: CompetencyIconProps) {
  let Icon = FallbackIcon
  switch (competency.name) {
    case 'Frontend':
    case 'Mobile':
    case 'Backend': {
      Icon = DevIcon
      break
    }
    case 'Дизайнер': {
      Icon = DesignIcon
      break
    }
    case 'Аналитик':
    case 'Тестировщик': {
      Icon = QAIcon
      break
    }
    case 'ML-инженер': {
      Icon = AIIcon
      break
    }
    default:
      Icon = FallbackIcon
      break
  }
  return <Icon className={className} />
}

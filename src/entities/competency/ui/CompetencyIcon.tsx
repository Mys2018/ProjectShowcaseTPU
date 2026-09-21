import type { Competency } from '../model/types'
import QAIcon from '../assets/qa.svg?react'
import AIIcon from '../assets/ai.svg?react'
import DevIcon from '../assets/dev.svg?react'
import DesignIcon from '../assets/design.svg?react'
import FallbackIcon from '../assets/fallback.svg?react'

export const isPseudoRole = (role?: string | null): boolean => {
  if (!role) return false
  const lower = role.trim().toLowerCase()
  return (
    lower === 'участник' ||
    lower === 'куратор проекта' ||
    lower === 'куратор' ||
    lower === 'менеджер данного проекта' ||
    lower === 'наставник'
  )
}

export interface CompetencyIconProps {
  competency?: Competency | string | null
  role?: string | null
  className?: string
}

export function CompetencyIcon({ competency, role, className = '' }: CompetencyIconProps) {
  const rawRoleName =
    role ??
    (typeof competency === 'string' ? competency : competency?.name) ??
    ''

  let Icon = FallbackIcon

  if (rawRoleName && !isPseudoRole(rawRoleName)) {
    const lower = rawRoleName.trim().toLowerCase()

    if (
      lower.includes('frontend') ||
      lower.includes('backend') ||
      lower.includes('mobile') ||
      lower.includes('разработчик') ||
      lower.includes('dev')
    ) {
      Icon = DevIcon
    } else if (
      lower.includes('дизайн') ||
      lower.includes('design') ||
      lower.includes('ui/ux') ||
      lower.includes('ux')
    ) {
      Icon = DesignIcon
    } else if (
      lower.includes('аналитик') ||
      lower.includes('анализ') ||
      lower.includes('тестиров') ||
      lower.includes('qa') ||
      lower.includes('тест')
    ) {
      Icon = QAIcon
    } else if (
      lower.includes('ml') ||
      lower.includes('ai') ||
      lower.includes('data science') ||
      lower.includes('машинн') ||
      lower.includes('искусственн')
    ) {
      Icon = AIIcon
    }
  }

  return <Icon className={className} />
}

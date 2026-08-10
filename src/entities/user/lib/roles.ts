import { ROLE_WEIGHTS } from '../config/constants'
import { type UserRole } from '../model/types'

export const getHighestRole = (roles: UserRole[]): UserRole => {
  if (!roles.length) return { type: 'Default', weight: ROLE_WEIGHTS.Default }
  return roles.reduce((highest, current) => (current.weight > highest.weight ? current : highest))
}

export const getSwitchableRolesAmount = (roles: UserRole[]): UserRole[] => {
  return roles.filter(r => r.type === 'Student' || r.type === 'Curator' || r.type === 'Moderator')
}

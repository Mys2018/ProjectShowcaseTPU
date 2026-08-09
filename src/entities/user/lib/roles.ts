import { ROLE_WEIGHTS } from '../config/constants'
import { type UserRole } from '../model/types'

export const getHighestRole = (roles: UserRole[]): UserRole => {
  if (!roles.length) return { type: 'Default', weight: ROLE_WEIGHTS.Default }
  return roles.reduce((highest, current) => (current.weight > highest.weight ? current : highest))
}

export const getUnusualRolesAmount = (roles: UserRole[]): number => {
  let count = 0
  roles.forEach(r => (r.type === 'Default' || r.type === 'Student') && count++)
  return count
}

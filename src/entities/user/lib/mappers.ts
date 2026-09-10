import { type User, type UserBase, type UserBaseDto, type UserDto, type UserRole } from '../model/types'
import { ROLE_WEIGHTS } from '../config/constants'
import { userIconUrl } from '@/shared'

const mapRoles = (dto: UserDto['roles']): UserRole[] => {
  return Object.entries(dto).map(([key, value]) => {
    const type = key as keyof UserDto['roles']
    return {
      type: type,
      weight: ROLE_WEIGHTS[type],
      ...value
    } as UserRole
  })
}

export const mapUserDto = (dto: UserDto): User => {
  const grade = dto.grade || dto.roles?.Student?.course
  const group = dto.group || dto.roles?.Student?.meta?.group
  const competencies = dto.meta.skills?.map(s => s.roleTypeName).filter(Boolean) || []

  return {
    id: String(dto.userId),
    email: dto.email,
    profilePicture: dto.profilePicture || userIconUrl,
    group,
    grade: Number(grade),
    competencies,
    meta: {
      name: `${dto.meta.firstName} ${dto.meta.lastName}`.trim(),
      firstName: dto.meta.firstName,
      lastName: dto.meta.lastName,
      bio: dto.meta.bio,
      interests: dto.meta.interests || '',
      skills: dto.meta.skills || [],
      experience: dto.meta.experience,
      messengers: dto.meta.messengers,
      portfolioLink: dto.meta.portfolioLink || ''
    },
    roles: mapRoles(dto.roles),
    capabilities: dto.capabilities || []
  }
}

const extractRawRoles = (roles?: string[] | UserDto['roles']): string[] => {
  if (Array.isArray(roles)) {
    return roles
  }
  if (roles && typeof roles === 'object') {
    return Object.keys(roles)
  }
  return []
}

const extractCompetencies = (dto: UserBaseDto | UserDto): string[] => {
  if ('skills' in dto.meta && Array.isArray(dto.meta.skills)) {
    return dto.meta.skills.map(s => s.roleTypeName).filter(Boolean)
  }
  return []
}

const extractGrade = (dto: UserBaseDto | UserDto): string | undefined => {
  if ('grade' in dto && dto.grade) {
    return dto.grade
  }
  if ('roles' in dto && dto.roles && typeof dto.roles === 'object' && !Array.isArray(dto.roles)) {
    return dto.roles.Student?.course
  }
  return undefined
}

export const mapUserBaseDto = (dto: UserBaseDto | UserDto): UserBase => {
  const firstName = dto.meta.firstName || ''
  const lastName = dto.meta.lastName || ''
  const computedName = `${firstName} ${lastName}`.trim()
  const name = computedName || dto.email || 'Без имени'

  const rawRoles = extractRawRoles(dto.roles)
  const competencies = extractCompetencies(dto)
  const grade = extractGrade(dto)

  return {
    id: String(dto.userId),
    email: dto.email,
    profilePicture: dto.profilePicture || userIconUrl,
    roles: rawRoles.map(roleName => {
      const type = roleName as keyof UserDto['roles']
      return {
        type,
        weight: ROLE_WEIGHTS[type] ?? 1
      } as UserRole
    }),
    competencies,
    grade: Number(grade),
    meta: {
      name,
      firstName,
      lastName
    }
  }
}

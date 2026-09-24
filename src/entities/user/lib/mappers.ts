import { type User, type UserBase, type UserBaseDto, type UserDto, type UserRole } from '../model/types'
import { ROLE_WEIGHTS } from '../config/constants'
import { userIconUrl } from '@/shared'

const mapRoles = (roles: UserDto['roles'] | undefined): UserRole[] => {
  if (!roles || typeof roles !== 'object') return []
  return Object.entries(roles).map(([key, value]) => {
    const type = key as keyof UserDto['roles']
    return {
      type: type,
      weight: ROLE_WEIGHTS[type],
      ...(value && typeof value === 'object' ? value : {})
    } as UserRole
  })
}

const parseGrade = (value: string | number | undefined | null): number | undefined => {
  if (value === undefined || value === null || value === '') return undefined
  const n = Number(value)
  return Number.isFinite(n) ? n : undefined
}

export const mapUserDto = (dto: UserDto): User => {
  // Курс студента лежит в roles.Student.course (см. StudentUseCase в api.yaml)
  const grade = parseGrade(dto.grade ?? dto.roles?.Student?.course)
  const group = dto.group || dto.roles?.Student?.meta?.group
  const competencies = dto.meta?.skills?.map(s => s.roleTypeName).filter(Boolean) || []
  const computedName = [dto.meta?.firstName, dto.meta?.lastName, dto.meta?.patronym].filter(Boolean).join(' ').trim()

  return {
    id: String(dto.userId),
    email: dto.email,
    profilePicture: dto.profilePicture || userIconUrl,
    group,
    grade,
    competencies,
    meta: {
      name: computedName || dto.email,
      firstName: dto.meta?.firstName,
      lastName: dto.meta?.lastName,
      patronym: dto.meta?.patronym,
      bio: dto.meta?.bio,
      interests: dto.meta?.interests || '',
      skills: dto.meta?.skills || [],
      experience: dto.meta?.experience,
      messengers: dto.meta?.messengers,
      portfolioLink: dto.meta?.portfolioLink || ''
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

const extractGroup = (dto: UserBaseDto | UserDto): string | undefined => {
  if ('group' in dto && dto.group) {
    return dto.group
  }
  if ('roles' in dto && dto.roles && typeof dto.roles === 'object' && !Array.isArray(dto.roles)) {
    return dto.roles.Student?.meta?.group
  }
  return undefined
}

export const mapUserBaseDto = (dto: UserBaseDto | UserDto): UserBase => {
  const firstName = dto.meta.firstName || ''
  const lastName = dto.meta.lastName || ''
  const patronym = ('patronym' in dto.meta && dto.meta.patronym) ? dto.meta.patronym : undefined
  const computedName = [firstName, lastName, patronym].filter(Boolean).join(' ').trim()
  const name = computedName || dto.email || 'Без имени'

  const rawRoles = extractRawRoles(dto.roles)
  const competencies = extractCompetencies(dto)
  const grade = extractGrade(dto)
  const group = extractGroup(dto)

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
    grade: grade ? Number(grade) : undefined,
    group,
    meta: {
      name,
      firstName,
      lastName,
      patronym
    }
  }
}

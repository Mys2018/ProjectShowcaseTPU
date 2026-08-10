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
  return {
    id: String(dto.userId),
    email: dto.email,
    profilePicture: dto.profilePicture || userIconUrl,
    group: dto.group,
    grade: dto.grade,
    meta: {
      name: `${dto.meta.firstName} ${dto.meta.lastName}`,
      firstName: dto.meta.firstName,
      lastName: dto.meta.lastName,
      bio: dto.meta.bio,
      skills: dto.meta.skills || [],
      experience: dto.meta.experience,
      messengers: dto.meta.messengers
    },
    roles: mapRoles(dto.roles),
    capabilities: dto.capabilities || []
  }
}

export const mapUserBaseDto = (dto: UserBaseDto): UserBase => {
  return {
    id: String(dto.userId),
    email: dto.email,
    profilePicture: dto.profilePicture || userIconUrl,
    roles:
      dto.roles?.map(roleName => {
        const type = roleName as keyof UserDto['roles']
        return {
          type: type,
          weight: ROLE_WEIGHTS[type]
        } as UserRole
      }) ?? [],
    meta: {
      name: `${dto.meta.firstName} ${dto.meta.lastName}`
    }
  }
}

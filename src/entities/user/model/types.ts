export type SkillDto = {
  skillId: string
  skillName: string
}

export type CompetenceDto = {
  roleTypeId: string
  roleTypeName: string
  skills: SkillDto[]
}

export type User = UserBase & {
  profilePicture: string
  group?: string
  grade?: string
  meta: {
    firstName: string
    lastName: string
    bio: string
    skills: CompetenceDto[]
    experience: string,
    messengers: Messengers,
    portfolioLink: string
  }
  capabilities: string[]
}

export type Messengers = {
  element: string
  telegram: string,
  vk: string,
}

export type MessengerType = keyof Messengers;

export type UserBase = {
  id: string
  email: string
  roles: UserRole[]
  meta: {
    name: string
  }
}

export type UserBaseDto = {
  userId: number
  email: string
  roles: string[]
  meta: {
    firstName: string
    lastName: string
  }
}

export type UserDto = {
  userId: number
  email: string
  profilePicture: string | null
  meta: {
    firstName: string
    lastName: string
    bio: string
    skills: CompetenceDto[]
    experience: string,
    messengers: Messengers,
    portfolioLink?: string
  }
  group?: string
  grade?: string
  roles: {
    Default?: {}
    Student?: {
      course: string
      school: string
      meta: {
        group: string
      }
    }
    Admin?: {}
    Curator?: {}
    Mentor?: {}
    Moderator?: {}
    ROOP?: {}
    Teacher?: {}
  }
  capabilities: string[] | null
}

type Role<T> = {
  [K in keyof Required<T>]: { type: K, weight: number } & T[K]
}[keyof Required<T>]

export type UserRole = Role<UserDto['roles']>
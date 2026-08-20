import { type User, type UserDto } from '../model/types'

export const ROLES_TRANSLATIONS: Record<keyof UserDto['roles'], string> = {
  Default: 'Пользователь',
  Student: 'Студент',
  Admin: 'Админ',
  Curator: 'Куратор',
  Mentor: 'Ментор',
  Moderator: 'Модератор',
  ROOP: 'РООП',
  Teacher: 'Преподаватель'
} as const

export const ROLE_WEIGHTS: Record<keyof UserDto['roles'], number> = {
  Default: 1,
  Student: 2,
  Admin: 6,
  Curator: 3,
  Mentor: 3,
  Moderator: 4,
  ROOP: 5,
  Teacher: 3,
}

export const placeholderUser: User = {
  id: 'loading...',
  email: `loading@example.com`,
  profilePicture: '',
  meta: {
    name: `Загрузка...`,
    firstName: `Загрузка...`,
    lastName: '',
    bio: '',
    skills: [],
    experience: '',
    portfolioLink: '',
    interests: '',
    messengers: {
      telegram: '',
      vk: '',
      element: ''
    }
  },
  roles: [{ type: 'Default', weight: ROLE_WEIGHTS.Default }],
  capabilities: []
}
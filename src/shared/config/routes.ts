
export const ROUTES = {
  MAIN: '/',
  LOGIN: '/login',
  PROFILE: {
    BASE: '/profile',
    BY_ID: '/profile/:id'
  },
  PROJECTS: {
    BASE: '/projects',
    RECRUITMENT: '/projects/recruitment',
    IN_PROGRESS: '/projects/in-progress',
    PROJECT: '/projects/:id',
    CREATE: '/projects/create'
  },
  ACTIVITY: {
    BASE: '/activity',
    MY_PROJECTS: '/activity#my-projects',
    MY_APPLICATIONS: '/activity#my-applications',
    FAVORITES: '/activity#favorites'
  },
  MANAGE: {
    BASE: '/manage',
    PROJECTS: '/manage#projects',
    TEAMS: '/manage#teams',
    GRADES: '/manage#grades'
  },
  MODERATION: {
    BASE: '/moderation',
    PROJECTS: '/moderation#projects',
    COMPLAINTS: '/moderation#complaints'
  }
} as const

export const buildRoute = {
  profileById: (id: string) => ROUTES.PROFILE.BY_ID.replace(':id', id),
  project: (id: string) => ROUTES.PROJECTS.PROJECT.replace(':id', id)
} as const

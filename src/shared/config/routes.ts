const MY_PLATFORM_BASE = '/my-platform'
const CATALOG_BASE = '/catalog'
const PROFILE_BASE = '/profile'

export const ROUTES = {
  MAIN: '/',
  LOGIN: '/login',
  PROFILE: {
    BASE: PROFILE_BASE,
    BY_ID: `${PROFILE_BASE}/:id`
  },
  CATALOG: {
    BASE: CATALOG_BASE,
    ALL_PROJECTS: `${CATALOG_BASE}/all-projects`,
    RECRUITING: `${CATALOG_BASE}/recruiting`,
    IN_WORK: `${CATALOG_BASE}/in-work`,
    PROJECT: `${CATALOG_BASE}/projects/:id`
  },
  MY_PLATFORM: {
    BASE: MY_PLATFORM_BASE,
    ACTIVITIES: `${MY_PLATFORM_BASE}/project-activities`,
    MY_APPLICATIONS: `${MY_PLATFORM_BASE}/my-applications`,
    MY_PROJECTS: `${MY_PLATFORM_BASE}/my-projects`,
    LIKES: `${MY_PLATFORM_BASE}/likes`,
    CREATE: `${MY_PLATFORM_BASE}/create`
  }
} as const

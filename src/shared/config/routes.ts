const MY_PLATFORM_BASE = '/my-platform'
const PROJECT_ACTIVITIES_BASE = `${MY_PLATFORM_BASE}/project-activities`
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
    ACTIVITIES: {
      BASE: PROJECT_ACTIVITIES_BASE,
      STUDENT: {
        PROJECTS: `${PROJECT_ACTIVITIES_BASE}/my-projects`,
        APPLICATIONS: `${PROJECT_ACTIVITIES_BASE}/my-applications`,
        LIKES: `${PROJECT_ACTIVITIES_BASE}/likes`
      },
      CURATOR: {
        PROJECTS: `${PROJECT_ACTIVITIES_BASE}/projects-management`,
        APPLICATIONS: `${PROJECT_ACTIVITIES_BASE}/incoming-applications`
      },
      MODERATOR: {
        PROJECTS: `${PROJECT_ACTIVITIES_BASE}/projects-moderation`,
        APPLICATIONS: `${PROJECT_ACTIVITIES_BASE}/moderation-applications`
      }
    },
    CREATE: `${MY_PLATFORM_BASE}/create`
  }
} as const

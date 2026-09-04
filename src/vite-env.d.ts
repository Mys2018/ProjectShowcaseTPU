/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_TPU_OAUTH_CLIENT_ID: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_OAUTH_AUTHORIZE_URL: string
  readonly VITE_API_AUTH_STATUS_URL: string
  readonly VITE_API_RELOGIN_URL: string
  readonly VITE_API_LOGIN_URL: string
  readonly VITE_API_LOGOUT_URL: string
  readonly VITE_API_ME_URL: string
  readonly VITE_API_USERS_URL: string
  readonly VITE_API_PROJECTS_URL: string
  readonly VITE_API_LIKED_PROJECTS_URL: string
  readonly VITE_API_PROJECT_DRAFT_URL: string
  readonly VITE_API_TAGS_URL: string
  readonly VITE_API_PARTNERS_URL: string
  readonly VITE_API_COMPETENCIES_URL: string
  readonly VITE_API_SKILLS_URL: string
  readonly VITE_API_CHECKPOINTS_URL: string,
  readonly VITE_APPLICATIONS_URL: string,
  readonly APPLICATION_SET_STATUS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

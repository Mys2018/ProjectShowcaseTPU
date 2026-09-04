
export type Category = 'Repository' | 'TaskTracker' | 'DesignEnvironment'

export interface Platform {
  platformId: string,
  name: string,
  category: Category
}

export interface GetPlatformsResponse {
  category: Category,
  platforms: Platform[],
}

export interface PostPlatformRequest {
  name: string,
  category: Category,
}

export interface PostPlatformResponse {
  platformId: string
}

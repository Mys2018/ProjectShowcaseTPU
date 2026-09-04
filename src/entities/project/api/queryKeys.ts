import type { GetLikedProjectsParams, GetProjectsQueryParams } from '../model/types'

export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (params?: GetProjectsQueryParams) => [...projectKeys.all, 'list', { ...params }] as const,
  likedList: (params?: GetLikedProjectsParams) => [...projectKeys.all, 'list', 'liked', { ...params }] as const,
  details: (id: string) => [...projectKeys.all, 'detail', id] as const,
  draft: () => [...projectKeys.all, 'draft'] as const
}

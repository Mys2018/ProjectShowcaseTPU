import type {
  GetLikedProjectsParams,
  GetManagedProjectsParams,
  GetParticipatingProjectsParams,
  GetAppliedProjectsParams,
  GetProjectsQueryParams,
} from '../model/types'

export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (params?: GetProjectsQueryParams) => [...projectKeys.all, 'list', { ...params }] as const,
  likedList: (params?: GetLikedProjectsParams) => [...projectKeys.all, 'list', 'liked', { ...params }] as const,
  managedList: (params?: GetManagedProjectsParams) => [...projectKeys.all, 'list', 'managed', { ...params }] as const,
  curatedList: (params?: GetManagedProjectsParams) => [...projectKeys.all, 'list', 'managed', { ...params }] as const,
  participatingList: (params?: GetParticipatingProjectsParams) => [...projectKeys.all, 'list', 'participating', { ...params }] as const,
  appliedList: (params?: GetAppliedProjectsParams) => [...projectKeys.all, 'list', 'applied', { ...params }] as const,
  details: (id: string) => [...projectKeys.all, 'detail', id] as const,
  draft: () => [...projectKeys.all, 'draft'] as const
}

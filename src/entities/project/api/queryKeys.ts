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
  // Отдельный сегмент: curated и managed — разные сущности; общий ключ
  // молча подсунул бы данные одного списка другому при расхождении эндпоинтов.
  curatedList: (params?: GetManagedProjectsParams) => [...projectKeys.all, 'list', 'curated', { ...params }] as const,
  participatingList: (params?: GetParticipatingProjectsParams) => [...projectKeys.all, 'list', 'participating', { ...params }] as const,
  appliedList: (params?: GetAppliedProjectsParams) => [...projectKeys.all, 'list', 'applied', { ...params }] as const,
  details: (id: string) => [...projectKeys.all, 'detail', id] as const,
  team: (id: string) => [...projectKeys.details(id), 'team'] as const,
  sprints: (id: string) => [...projectKeys.details(id), 'sprints'] as const,
  sprintGrading: (id: string, sprintId: string) => [...projectKeys.sprints(id), sprintId, 'grading'] as const,
  timesheetSummary: (id: string) => [...projectKeys.details(id), 'timesheet-summary'] as const,
  draft: () => [...projectKeys.all, 'draft'] as const,
  review: (id: string) => [...projectKeys.all, 'review', id] as const
}

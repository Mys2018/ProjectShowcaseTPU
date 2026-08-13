import type { GetProjectsQueryParams } from '../model/types';

export const projectKeys = {
  all: ['projects'] as const,
  lists: (params?: GetProjectsQueryParams) => [...projectKeys.all, 'list', { ...params }] as const,
  details: (id: string) => [...projectKeys.all, 'detail', id] as const,
  draft: () => [...projectKeys.all, 'draft'] as const,
};
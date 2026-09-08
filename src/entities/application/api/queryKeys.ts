import type { GetApplicationsQueryParams } from '../model/types';

export const applicationKeys = {
  all: ['applications'] as const,
  lists: () => [...applicationKeys.all, 'list'] as const,
  list: (filters?: GetApplicationsQueryParams) => [...applicationKeys.lists(), filters] as const,
};

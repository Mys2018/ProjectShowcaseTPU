import { useQuery } from '@tanstack/react-query';
import { getApplications } from './requests';
import type { GetApplicationsQueryParams } from '../model/types';
import { applicationKeys } from './queryKeys';

export const useApplications = (params: GetApplicationsQueryParams) => {
  return useQuery({
    queryKey: applicationKeys.list(params),
    queryFn: () => getApplications(params),
  });
};

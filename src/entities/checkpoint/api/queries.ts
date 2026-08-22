import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'
import { getCheckpointGroups } from './requests'

export const useCheckpointGroups = (limit: number = 10, offset: number = 0) => {
  return useQuery({
    queryKey: queryKeys.all,
    queryFn: () => getCheckpointGroups(limit, offset),
    staleTime: 60 * 1000
  })
}

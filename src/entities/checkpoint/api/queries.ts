import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'
import { getCheckpointGroups, getCurrentCheckpoints } from './requests'

export const useCheckpointGroups = (limit: number = 10, offset: number = 0) => {
  return useQuery({
    queryKey: queryKeys.all,
    queryFn: () => getCheckpointGroups(limit, offset),
    staleTime: 60 * 1000
  })
}

export const useCurrentCheckpoints = (enabled?: boolean) => {
  return useQuery({
    queryKey: queryKeys.current,
    queryFn: getCurrentCheckpoints,
    enabled: enabled ?? true,
    staleTime: 1000 * 60 * 10
  })
}

import { useQuery } from '@tanstack/react-query'
import { getPartnerById, getPartners } from './requests'
import { queryKeys } from './queryKeys'

export const usePartners = () => {
  return useQuery({
    queryKey: queryKeys.all,
    queryFn: getPartners,
    staleTime: 60 * 1000
  })
}

export const usePartnerById = (partnerId: string, enabled?: boolean) => {
  return useQuery({
    queryKey: queryKeys.partner(partnerId),
    queryFn: () => getPartnerById(partnerId),
    enabled: enabled,
    staleTime: 60 * 1000
  })
}

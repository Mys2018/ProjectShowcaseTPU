import { useQuery } from '@tanstack/react-query';
import { getPartners } from './requests';
import { partnerQueryKeys } from './queryKeys';

export const usePartners = () => {
  return useQuery({
    queryKey: partnerQueryKeys.all,
    queryFn: getPartners,
    staleTime: 60 * 1000,
  });
};

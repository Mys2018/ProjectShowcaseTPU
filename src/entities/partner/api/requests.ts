import { api } from '@/shared';
import type { GetPartnersResponse, PartnerDto } from './types';

export const getPartners = async (): Promise<PartnerDto[]> => {
  const { data } = await api.get<GetPartnersResponse>('/partners');
  return data.partners;
};

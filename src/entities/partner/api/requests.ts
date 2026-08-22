import { mapPartnerDto } from '../lib/mappers';
import type { GetPartnersResponse, PartnerDto } from './types';
import { api, ENDPOINTS } from '@/shared';

export const getPartners = async (): Promise<PartnerDto[]> => {
  const { data } = await api.get<GetPartnersResponse>(ENDPOINTS.PARTNERS);
  return data.partners.map(mapPartnerDto);
};

export const getPartnerById = async (partnerId: string): Promise<PartnerDto> => {
  const { data } = await api.get<PartnerDto>(ENDPOINTS.PARTNER_BY_ID(partnerId));
  return mapPartnerDto(data);
};

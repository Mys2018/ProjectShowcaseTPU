import { mapPartnerDto } from '../lib/mappers';
import type { GetPartnersResponse, PartnerDto } from './types';
import { api } from '@/shared';

export const getPartners = async (): Promise<PartnerDto[]> => {
  const { data } = await api.get<GetPartnersResponse>('/partners');
  return data.partners.map(mapPartnerDto);
};

export const getPartnerById = async (parentId: string): Promise<PartnerDto> => {
  const { data } = await api.get<PartnerDto>(`/partners/${parentId}`);
  return mapPartnerDto(data);
};

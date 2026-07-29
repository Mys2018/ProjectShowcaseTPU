export interface PartnerDto {
  id: string;
  name: string;
}

export interface GetPartnersResponse {
  partners: PartnerDto[];
}

export interface PartnerDto {
  id: string;
  name: string;
  profilePicture: string
}

export interface GetPartnersResponse {
  partners: PartnerDto[];
}


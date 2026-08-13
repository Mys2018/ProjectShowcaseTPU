import type {Messengers} from "@/entities/user/model/types.ts";

export interface OAuthExchangeParams {
  code: string;
  codeVerifier: string;
}

export interface AuthStatusResponse {
  userID: number;
}

export interface RoleTypeDto {
  id: string;
  name: string;
}

export interface UpdateProfileMetaRequest {
  bio?: string;
  experience?: string;
  messengers?: Messengers;
  portfolioLink?: string;
  skills?: {
    roleTypeId: string;
    skillIds: string[];
  }[];
}
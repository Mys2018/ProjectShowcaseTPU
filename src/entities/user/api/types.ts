import type {Messengers, UserDto} from "../model/types.ts";

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
  interests?: string;
  messengers?: Messengers;
  portfolioLink?: string;
  skills?: {
    roleTypeId: string;
    skillIds: string[];
  }[];
}

export interface GetUsersRequest {
  query: string;
  limit?: number;
  offset?: number;
}

export interface GetUsersResponse {
  users: UserDto
}
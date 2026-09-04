import type {GetPlatformsResponse, PostPlatformRequest, PostPlatformResponse} from "../model/types.ts";
import {api, ENDPOINTS} from "@/shared";

export const getPlatforms = async () : Promise<GetPlatformsResponse[]> => {
  const { data } = await api.get<GetPlatformsResponse[]>(ENDPOINTS.PLATFORMS)
  return data
}

export const postPlatform = async ({ name, category}: PostPlatformRequest): Promise<PostPlatformResponse> => {
  const { data } = await api.post<PostPlatformResponse>(ENDPOINTS.PLATFORMS, { name, category })
  return data
}


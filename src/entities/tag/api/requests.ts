import type { TagGroup } from '../model/types'
import type { GetTagsResponse } from './types'
import { mapTagDto } from '../lib/mappers'
import { api, ENDPOINTS } from '@/shared'

export const getTags = async (): Promise<TagGroup[]> => {
  const { data } = await api.get<GetTagsResponse>(ENDPOINTS.TAGS)
  return data.map(dto => ({ id: dto.groupId, name: dto.groupName, tags: dto.tags.map(mapTagDto) }))
}

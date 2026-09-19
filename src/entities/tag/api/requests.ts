import type { TagGroup } from '../model/types'
import type { GetTagsResponse } from './types'
import { mapTagDto } from '../lib/mappers'
import { api, ENDPOINTS } from '@/shared'

export const getTags = async (): Promise<TagGroup[]> => {
  try {
    const { data } = await api.get<GetTagsResponse>(ENDPOINTS.TAGS)
    if (!Array.isArray(data)) return []
    return data.map(dto => ({
      id: dto.groupId,
      name: dto.groupName,
      tags: Array.isArray(dto.tags) ? dto.tags.map(mapTagDto) : []
    }))
  } catch (err) {
    console.error('Failed to load tags:', err)
    return []
  }
}

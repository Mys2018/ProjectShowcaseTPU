import { mapCheckpointGroupDto, mapCheckpointGroupToDto, mapCheckpointToDto } from '../lib/mappers'
import type { CheckpointDto, CheckpointGroup, CheckpointGroupDto } from '../model/types'
import type { GetCheckpointGroupsResponse } from './types'
import { api, ENDPOINTS } from '@/shared'

export const getCheckpointGroups = async (
  limit: number = 10,
  offset: number = 0
): Promise<{ checkpointGroups: CheckpointGroup[]; total: number }> => {
  const params = { offset, limit }
  const { data } = await api.get<GetCheckpointGroupsResponse>(ENDPOINTS.CHECKPOINTS, { params })
  return { total: data.total, checkpointGroups: (data.checkpoints || []).map(mapCheckpointGroupDto) }
}

export const getCurrentCheckpoints = async (): Promise<CheckpointGroup> => {
  // 1. Попытка запросить /projects/checkpoints/current
  try {
    const { data } = await api.get<CheckpointGroupDto>(ENDPOINTS.CHECKPOINTS_CURRENT)
    if (data && Array.isArray(data.checkpoints) && data.checkpoints.length > 0) {
      const group = mapCheckpointGroupDto(data)
      if (group.id) return group
    }
  } catch (err) {
    // 404 ожидаем, если current не назначен — пробуем взять из общего списка
  }

  // 2. Попытка взять первый набор из /projects/checkpoints
  try {
    const { data } = await api.get<GetCheckpointGroupsResponse>(ENDPOINTS.CHECKPOINTS, {
      params: { offset: 0, limit: 10 }
    })
    const list = data?.checkpoints || []
    if (list.length > 0) {
      const first = list[0]
      if (first) {
        const group = mapCheckpointGroupDto(first)
        if (group.id) return group
      }
    }
  } catch (err) {
    console.warn('GET /projects/checkpoints error:', err)
  }

  return {
    id: '',
    title: '',
    checkpoints: []
  }
}

export const createCheckpointGroup = async (payload: Omit<CheckpointGroup, 'id'>): Promise<string> => {
  const payloadDto: { name: string; checkpoints: CheckpointDto[] } = {
    name: payload.title,
    checkpoints: payload.checkpoints.map(mapCheckpointToDto)
  }
  const { data } = await api.post<{ checkpointId: string }>(ENDPOINTS.CHECKPOINTS, payloadDto)
  return data.checkpointId
}

export const editCheckpointGroup = async (payload: CheckpointGroup): Promise<void> => {
  await api.put(ENDPOINTS.CHECKPOINT_BY_ID(payload.id), mapCheckpointGroupToDto(payload))
}

export const removeCheckpointGroup = async (checkpointId: string): Promise<void> => {
  await api.delete(ENDPOINTS.CHECKPOINT_BY_ID(checkpointId))
}

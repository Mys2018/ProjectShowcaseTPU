import { mapCheckpointGroupDto, mapCheckpointGroupToDto, mapCheckpointToDto } from '../lib/mappers'
import type { CheckpointDto, CheckpointGroup } from '../model/types'
import type { GetCheckpointGroupsResponse } from './types'
import { api, ENDPOINTS } from '@/shared'

export const getCheckpointGroups = async (
  limit: number,
  offset: number
): Promise<{ checkpointGroups: CheckpointGroup[]; total: number }> => {
  const params = { offset, limit }
  const { data } = await api.get<GetCheckpointGroupsResponse>(ENDPOINTS.CHECKPOINTS, { params })
  return { total: data.total, checkpointGroups: data.checkpoints.map(mapCheckpointGroupDto) }
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

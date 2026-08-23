import type { Checkpoint, CheckpointDto, CheckpointGroup, CheckpointGroupDto } from '../model/types'
import { mapDateToBackendString, mapStringToDate } from '@/shared'

export const mapCheckpointDto = (dto: CheckpointDto): Checkpoint => {
  const deadline = mapStringToDate(dto.deadline)
  return { title: dto.title, deadline: deadline }
}

export const mapCheckpointGroupDto = (dto: CheckpointGroupDto): CheckpointGroup => ({
  id: dto.id,
  title: dto.name,
  checkpoints: dto.checkpoints.map(mapCheckpointDto)
})

export const mapCheckpointToDto = (checkpoint: Checkpoint): CheckpointDto => ({
  title: checkpoint.title,
  deadline: mapDateToBackendString(checkpoint.deadline)
})

export const mapCheckpointGroupToDto = (group: CheckpointGroup): CheckpointGroupDto => {
  const dtoCheckpoints: CheckpointDto[] = group.checkpoints.map(mapCheckpointToDto)
  return { id: group.id, name: group.title, checkpoints: dtoCheckpoints }
}

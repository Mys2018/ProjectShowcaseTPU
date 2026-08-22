import type { CheckpointGroupDto } from "../model/types"

export type GetCheckpointGroupsResponse = {
	offset: number
	limit: number
	total: number
	checkpoints: CheckpointGroupDto[]
}
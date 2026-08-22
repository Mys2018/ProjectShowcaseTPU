export type Checkpoint = {
	title: string
	deadline: Date
}

export type CheckpointGroup = {
	id: string
	title: string
	checkpoints: Checkpoint[]
}

export type CheckpointDto = {
	title: string
	deadline: string
}

export type CheckpointGroupDto = {
	id: string
	name: string
	checkpoints: CheckpointDto[]
}

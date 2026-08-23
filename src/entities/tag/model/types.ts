export type Tag = {
	id: string
	name: string
	groupId: string
}

export type TagGroup = {
	id: string
	name: string
	tags: Tag[]
}

export type TagDto = {
	groupId: string
  tagId: string
  tagName: string
}
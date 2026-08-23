import type { Tag, TagDto } from "../model/types";

export const mapTagDto = (dto: TagDto): Tag => ({
	id: dto.tagId,
	name: dto.tagName,
	groupId: dto.groupId
})
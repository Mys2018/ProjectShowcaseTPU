import type { Tag } from '../model/types'

export const getSortedTags = (tags: Tag[], primaryTag: Tag): Tag[] => {
  return [primaryTag, ...tags.filter(tag => tag.id !== primaryTag.id)]
}

import type { ProjectTag } from '../model/types'

export const getProjectTagBackground = (tag: string) => {
  switch (tag) {
    case 'Веб-разработка':
      return 'var(--grad-fiolet)'
    case 'Инженерия':
      return 'var(--grad-blue)'
    case 'E-commerce':
    case 'VR/AR':
      return 'var(--grad-orange)'
    case 'Мобайл-разработка':
      return 'var(--grad-green)'
    default:
      return 'var(--grad-blue)'
  }
}

export const getSortedTags = (tags: ProjectTag[], primaryTag: ProjectTag): ProjectTag[] => {
  return [primaryTag, ...tags.filter(tag => tag.tagId !== primaryTag.tagId)]
}

import { create } from 'zustand'
import type { SortKey } from './types'
import type { ProjectFormat } from '@/entities/project'

interface FilterState {
  projectTypes: Set<ProjectFormat>
  tags: Set<string>
  competencies: Set<string>
  sort: Exclude<SortKey, 'relevance'>
  isRelevanceSort: boolean

  query: string
  limit: number
  page: number

  toggleProjectType: (value: ProjectFormat) => void
  toggleTag: (value: string) => void
  toggleCompetency: (value: string) => void
  toggleIsRelevanceSort: (value?: boolean) => void

  setSort: (value: Exclude<SortKey, 'relevance'>) => void

  setQuery: (query: string) => void
  setLimit: (limit: number) => void
  setPage: (page: number) => void

  reset: () => void
}

export const useFilterStore = create<FilterState>(set => ({
  projectTypes: new Set(),
  tags: new Set(),
  competencies: new Set(),
  sort: 'created_desc',
  isRelevanceSort: false,

  query: '',
  limit: 20,
  page: 1,

  toggleProjectType: value =>
    set(state => {
      const newProjectTypes = new Set(state.projectTypes)
      if (newProjectTypes.has(value)) {
        newProjectTypes.delete(value)
      } else {
        newProjectTypes.add(value)
      }
      return { projectTypes: newProjectTypes }
    }),
  toggleTag: value =>
    set(state => {
      const newTags = new Set(state.tags)
      if (newTags.has(value)) {
        newTags.delete(value)
      } else {
        newTags.add(value)
      }
      return { tags: newTags }
    }),
  toggleCompetency: value =>
    set(state => {
      const newCompetencies = new Set(state.competencies)
      if (newCompetencies.has(value)) {
        newCompetencies.delete(value)
      } else {
        newCompetencies.add(value)
      }
      return { competencies: newCompetencies }
    }),
  toggleIsRelevanceSort: value => set(state => ({ isRelevanceSort: value ?? !state.isRelevanceSort })),

  setSort: value => set({ sort: value }),

  setQuery: value => set({ query: value }),
  setLimit: value => set({ limit: value }),
  setPage: value => set({ page: value }),

  reset: () =>
    set({
      projectTypes: new Set(),
      tags: new Set(),
      competencies: new Set(),
      query: '',
      page: 1,
      isRelevanceSort: false
    })
}))


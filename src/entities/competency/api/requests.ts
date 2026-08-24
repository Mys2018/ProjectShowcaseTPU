import type { Competency } from '../model/types'
import { api, ENDPOINTS } from '@/shared'

export const getCompetencies = async (): Promise<Competency[]> => {
  const { data } = await api.get<Competency[]>(ENDPOINTS.COMPETENCIES)
  return data
}

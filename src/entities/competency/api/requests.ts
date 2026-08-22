import type { Competence } from '../model/types'
import { api, ENDPOINTS } from '@/shared'

export const getCompetencies = async (): Promise<Competence[]> => {
  const { data } = await api.get<Competence[]>(ENDPOINTS.COMPETENCIES)
  return data
}

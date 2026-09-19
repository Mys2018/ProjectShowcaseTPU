import type { Competency } from '../model/types'
import { api, ENDPOINTS } from '@/shared'

export const getCompetencies = async (): Promise<Competency[]> => {
  try {
    const { data } = await api.get<any>(ENDPOINTS.COMPETENCIES)
    if (Array.isArray(data)) {
      return data.map(item => ({
        id: item.id || item.roleTypeId || '',
        name: item.name || item.roleTypeName || ''
      }))
    }
    if (data && typeof data === 'object') {
      const list = data.roleTypes || data.items || data.competencies || data.data || []
      if (Array.isArray(list)) {
        return list.map((item: any) => ({
          id: item.id || item.roleTypeId || '',
          name: item.name || item.roleTypeName || ''
        }))
      }
    }
    return []
  } catch (err) {
    console.error('Failed to load competencies:', err)
    return []
  }
}

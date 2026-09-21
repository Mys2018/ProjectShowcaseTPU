import type { Competency } from '../model/types'

export const getCompetencyVerbal = (name: Competency['name']): string => {
  switch (name) {
    case 'Тестировка':
      return 'Тестировщик'
    default:
      return name
  }
}

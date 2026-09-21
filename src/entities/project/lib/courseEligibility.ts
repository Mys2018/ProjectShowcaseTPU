import type { ProjectFormat } from '../model/types'

/**
 * Допустимые курсы студентов для каждого типа проекта:
 * - Учебный (Study): 1–2 курсы
 * - Кейсовый (Case): 1–4 курсы (все 4 курса)
 * - Реальный (Real): 3–4 курсы
 */
export const ALLOWED_COURSES_BY_PROJECT_TYPE: Record<ProjectFormat, number[]> = {
  Study: [1, 2],
  Case: [1, 2, 3, 4],
  Real: [3, 4]
}

/**
 * Проверяет, подходит ли курс студента для типа проекта.
 * Если тип проекта или курс не задан, ограничение не блокирует отклик.
 */
export const isProjectCourseEligible = (projectType?: ProjectFormat, grade?: number | null): boolean => {
  if (!projectType || grade === undefined || grade === null || isNaN(grade)) {
    return true
  }

  const allowedCourses = ALLOWED_COURSES_BY_PROJECT_TYPE[projectType]
  if (!allowedCourses) {
    return true
  }

  return allowedCourses.includes(grade)
}

/**
 * Возвращает текст ограничения для типа проекта, если курс не подходит.
 */
export const getCourseRestrictionText = (projectType?: ProjectFormat): string => {
  switch (projectType) {
    case 'Study':
      return 'Отклик доступен только для 1–2 курсов'
    case 'Real':
      return 'Отклик доступен только для 3–4 курсов'
    case 'Case':
      return 'Отклик доступен только для 1–4 курсов'
    default:
      return 'Отклик недоступен для вашего курса'
  }
}

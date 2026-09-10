import type { ProjectFormat, ProjectStatus } from '../model/types'

export const getProjectFormatTranslation = (format: ProjectFormat) => {
  switch (format) {
    case 'Case':
      return 'Кейсовый'
    case 'Study':
      return 'Учебный'
    case 'Real':
      return 'Реальный'
  }
}

export const getProjectStatusTranslation = (status: ProjectStatus) => {
  switch (status) {
    case 'Active':
      return 'Активен'
    case 'Approved':
      return 'Утверждён'
    case 'Completed':
      return 'Завершён'
    case 'InProgress':
      return 'В работе'
    case 'NeedsRework':
      return 'Требует доработки'
    case 'NotImplemented':
      return 'Не реализован'
    case 'Pending':
      return 'На модерации'
    case 'Recruiting':
      return 'Набор на проект'
    case 'RecruitmentCompleted':
      return 'Набор завершён'
    case 'Rejected':
      return 'Отклонён модератором'
    default:
      return 'Нет статуса'
  }
}

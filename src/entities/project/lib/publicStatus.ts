import type { ProjectCardData, ProjectStatus } from '../model/types'

/** Есть ли в роли хотя бы одно незанятое место. Занято оно мной или кем-то — не важно. */
export const hasFreePlace = (role: ProjectCardData['roles'][number]) =>
  role.placesCount - role.placeUserIds.length > 0

/** Остались ли в проекте компетенции, на которые вообще можно податься. */
export const hasFreePlaces = (project: ProjectCardData) => project.roles.some(hasFreePlace)

/**
 * Сквозной публичный статус проекта — тот, что показывается и на ПК, и в панели.
 *
 * Три статуса набора приходят не из API, а выводятся (по макету дизайнера):
 * есть свободные компетенции → «Набор на проект»; свободных нет, но работы ещё
 * не стартовали → «Набор завершён»; работы стартовали → «В работе».
 * Поэтому Recruiting / RecruitmentCompleted в OpenAPI и отсутствуют.
 *
 * TODO: «старт работ» определяется первой ключевой точкой, но признака «точка
 * наступила» в API нет — пока опираемся на статус проекта с бэкенда.
 */
export const getPublicProjectStatus = (project: ProjectCardData): ProjectStatus => {
  const { status } = project

  // Работы идут — набор уже не при чём, что бы ни было со свободными местами.
  if (status === 'InProgress') return 'InProgress'

  // Терминальные статусы приходят с бэкенда как есть.
  if (status === 'Completed' || status === 'NotImplemented' || status === 'Rejected') return status

  // Фаза набора: место есть — набираем, места кончились — набор завершён.
  if (status === 'Recruiting' || status === 'RecruitmentCompleted') {
    return hasFreePlaces(project) ? 'Recruiting' : 'RecruitmentCompleted'
  }

  // Pending, NeedsRework и всё незнакомое отдаём как есть — их рисует сам компонент.
  return status
}

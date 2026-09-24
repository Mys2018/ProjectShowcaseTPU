import { useParticipatingProjects, useAppliedProjects } from '../api'
import { isActiveParticipatingProject } from '../lib/publicStatus'

/**
 * Сколько проектов студент может держать в работе одновременно.
 *
 * TODO: серверной проверки нет — ни поля, ни кода ошибки в OpenAPI. Лимит делают
 * отдельно; здесь он считается на клиенте, чтобы состояние панели было видно.
 * Когда появится проверка на бэкенде — брать признак оттуда, а не считать.
 */
const PROJECT_LIMIT = 5

/**
 * Взяли ли меня уже в какой-то другой *активный* проект. Если да — откликаться
 * больше нельзя, и панель на всех прочих проектах показывает «Вы уже в другом проекте».
 *
 * Считаем по /me/projects/participating, но терминальные статусы (NotImplemented,
 * Completed, Archived, Rejected) в блокировку не входят — место «активного»
 * участия они больше не занимают.
 */
export const useIsInOtherProject = (currentProjectId: string, enabled = true) => {
  const { data } = useParticipatingProjects({ offset: 0, limit: 100 }, enabled)
  const projects = data?.projects ?? []
  return projects.some(
    (p) => String(p.id) !== String(currentProjectId) && isActiveParticipatingProject(p)
  )
}

/**
 * Исчерпан ли лимит проектов. Текущий проект из счёта исключаем: если я уже
 * подавался сюда, лимит меня в этом же проекте блокировать не должен.
 * Заявки на нереализованные/завершённые проекты тоже не считаем.
 */
export const useProjectLimitReached = (currentProjectId: string, enabled = true) => {
  const { data } = useAppliedProjects({ offset: 0, limit: 100 }, enabled)
  const others = (data?.projects ?? []).filter(
    (p) => String(p.id) !== String(currentProjectId) && isActiveParticipatingProject(p)
  )
  return others.length >= PROJECT_LIMIT
}

import { useParticipatingProjects, useAppliedProjects } from '@/entities/project'

/**
 * Сколько проектов студент может держать в работе одновременно.
 *
 * TODO: серверной проверки нет — ни поля, ни кода ошибки в OpenAPI. Лимит делают
 * отдельно; здесь он считается на клиенте, чтобы состояние панели было видно.
 * Когда появится проверка на бэкенде — брать признак оттуда, а не считать.
 */
const PROJECT_LIMIT = 5

/**
 * Взяли ли меня уже в какой-то другой проект. Если да — откликаться больше нельзя,
 * и панель на всех прочих проектах показывает «Вы уже в другом проекте».
 *
 * Считаем по /me/projects/participating: участие — это занятое место в роли,
 * то есть именно «взяли», а не «подал заявку».
 */
export const useIsInOtherProject = (currentProjectId: string, enabled = true) => {
  const { data } = useParticipatingProjects({ offset: 0, limit: 100 }, enabled)
  const projects = data?.projects ?? []
  return projects.some(p => String(p.id) !== String(currentProjectId))
}

/**
 * Исчерпан ли лимит проектов. Текущий проект из счёта исключаем: если я уже
 * подавался сюда, лимит меня в этом же проекте блокировать не должен.
 */
export const useProjectLimitReached = (currentProjectId: string, enabled = true) => {
  const { data } = useAppliedProjects({ offset: 0, limit: 100 }, enabled)
  const others = (data?.projects ?? []).filter(p => String(p.id) !== String(currentProjectId))
  return others.length >= PROJECT_LIMIT
}

import { toMyHoursModel } from './toMyHoursModel'
import { getStudentProjectHours, useProjectSprints, useProjectTimesheetSummary } from '@/entities/project'
import { useMe } from '@/entities/user'

export const useMyProjectHours = (projectId: string) => {
  const { data: me, isLoading: isMeLoading, isError: isMeError } = useMe()
  // Локальная дата в YYYY-MM-DD: шведская локаль форматирует ровно так.
  const today = new Date().toLocaleDateString('sv-SE')

  const sprints = useProjectSprints(projectId)
  const summary = useProjectTimesheetSummary(projectId)

  // без me не найти себя в сводке: таблица мигнула бы пустой и с нулём в итоге
  const isLoading = sprints.isLoading || summary.isLoading || isMeLoading
  // без меня в сводке таблица вышла бы пустой, а не с ошибкой
  const isError = sprints.isError || summary.isError || isMeError

  const data =
    sprints.data && me && !isLoading
      ? toMyHoursModel({ sprints: sprints.data, summary: summary.data, studentId: me?.id, today })
      : undefined

  // Итог — сразу из сводки и тем же способом, что на карточке: не ждёт спринтов и не
  // показывает «0 баллов», пока грузится или если упали только спринты.
  const total = summary.data && me ? getStudentProjectHours(summary.data, me.id) : undefined

  return { data, total, isLoading, isError }
}

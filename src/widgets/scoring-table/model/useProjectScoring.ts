import { toScoringModel } from './toScoringModel'
import { useProjectSprints, useProjectTeam, useSprintsGradingStatus } from '@/entities/project'
import { useMe } from '@/entities/user'

export const useProjectScoring = (projectId: string) => {
  const { data: me } = useMe()
  // Локальная дата в YYYY-MM-DD: шведская локаль форматирует ровно так.
  const today = new Date().toLocaleDateString('sv-SE')

  const sprints = useProjectSprints(projectId)
  const team = useProjectTeam(projectId)
  // Будущие спринты не запрашиваем — часов в них ещё быть не может.
  const startedIds = (sprints.data ?? []).filter(s => s.startDate <= today).map(s => s.id)
  const gradings = useSprintsGradingStatus(projectId, startedIds)

  const isLoading = sprints.isLoading || team.isLoading || gradings.isLoading
  // Без команды таблица всё равно строится из табеля, поэтому её ошибка не фатальна.
  const isError = sprints.isError || gradings.isError

  const data =
    sprints.data && !isLoading
      ? toScoringModel({ sprints: sprints.data, gradings: gradings.data, team: team.data ?? [], today, viewerId: me?.id })
      : undefined

  return { data, isLoading, isError }
}

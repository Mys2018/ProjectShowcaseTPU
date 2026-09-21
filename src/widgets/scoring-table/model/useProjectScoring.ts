import { toScoringModel } from './toScoringModel'
import { useProjectDetails, useProjectSprints, useProjectTeam, useSprintsGradingStatus } from '@/entities/project'
import { useMe } from '@/entities/user'

export const useProjectScoring = (projectId: string) => {
  const { data: me } = useMe()
  // Локальная дата в YYYY-MM-DD: шведская локаль форматирует ровно так.
  const today = new Date().toLocaleDateString('sv-SE')

  const sprints = useProjectSprints(projectId)
  const team = useProjectTeam(projectId)
  const project = useProjectDetails(projectId)
  // Будущие спринты не запрашиваем — часов в них ещё быть не может.
  const startedIds = (sprints.data ?? []).filter(s => s.startDate <= today).map(s => s.id)
  const gradings = useSprintsGradingStatus(projectId, startedIds)

  const isLoading = sprints.isLoading || team.isLoading || project.isLoading || gradings.isLoading
  // Без команды и проекта таблица всё равно строится из табеля (без компетенций), поэтому их ошибка не фатальна.
  const isError = sprints.isError || gradings.isError

  const data =
    sprints.data && !isLoading
      ? toScoringModel({
          sprints: sprints.data,
          gradings: gradings.data,
          team: team.data ?? [],
          projectRoles: project.data?.roles,
          today,
          viewerId: me?.id
        })
      : undefined

  return { data, isLoading, isError }
}

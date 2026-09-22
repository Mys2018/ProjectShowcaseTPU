import type { ScoringSprint } from './types'
import { toSprintAxis, WEEKS_PER_SPRINT } from './toScoringModel'
import type { ProjectSprint, ProjectTimesheetSummaryResponse } from '@/entities/project'

/** Часы одного студента — для сводки в попапе с карточки проекта. */
export interface MyHoursModel {
  sprints: ScoringSprint[]
  /** Абсолютный индекс текущей недели (0-based), -1 — активного спринта нет. */
  currentWeekIndex: number
  /** `sprints.length * 2` элементов. `null` — часы не выставлены. */
  hours: (number | null)[]
  /** Выровнено с `hours`: `true` — студента тогда ещё не было в проекте (прочерк). */
  absent: boolean[]
}

interface MyHoursSources {
  sprints: ProjectSprint[]
  summary?: ProjectTimesheetSummaryResponse
  studentId?: string
  /** Сегодня в формате YYYY-MM-DD. */
  today: string
}

export const toMyHoursModel = ({ sprints, summary, studentId, today }: MyHoursSources): MyHoursModel => {
  const { ordered, sprints: axis, currentWeekIndex } = toSprintAxis(sprints, today)
  const me = summary?.students?.find(s => String(s.studentId) === String(studentId))

  const hours: (number | null)[] = []
  const absent: boolean[] = []
  for (const sprint of ordered) {
    const mine = me?.sprints?.find(s => s.sprintId === sprint.id)
    // Спринт уже шёл, а в моей сводке его нет — значит, меня тогда в проекте не было.
    // Если студента в сводке нет совсем, судить не по чему: ячейки остаются пустыми.
    const wasAbsent = Boolean(me) && !mine && sprint.startDate <= today
    for (let w = 0; w < WEEKS_PER_SPRINT; w++) {
      hours.push(mine?.hoursByWeeks?.[w] ?? null)
      absent.push(wasAbsent)
    }
  }

  return { sprints: axis, currentWeekIndex, hours, absent }
}

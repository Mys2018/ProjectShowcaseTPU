import type { ScoringModel, StudentRow, WeekCell } from './types'
import type { ProjectSprint, SprintGradingStatus } from '@/entities/project'
import type { UserCard } from '@/entities/user'

export const WEEKS_PER_SPRINT = 2
const DAY_MS = 24 * 60 * 60 * 1000

interface ScoringSources {
  sprints: ProjectSprint[]
  gradings: SprintGradingStatus[]
  team: UserCard[]
  /** Сегодня в формате YYYY-MM-DD — параметром, чтобы маппер был чистым. */
  today: string
  /** id текущего пользователя: если он есть в таблице, его строка идёт первой. */
  viewerId?: string
}

export const toScoringModel = ({ sprints, gradings, team, today, viewerId }: ScoringSources): ScoringModel => {
  const ordered = [...sprints].sort((a, b) => a.startDate.localeCompare(b.startDate))
  const weekCount = ordered.length * WEEKS_PER_SPRINT

  const currentSprint = ordered.findIndex(s => s.isCurrent)
  const currentWeekIndex =
    currentSprint < 0
      ? -1
      : currentSprint * WEEKS_PER_SPRINT +
        (Date.parse(today) - Date.parse(ordered[currentSprint].startDate) >= 7 * DAY_MS ? 1 : 0)

  // Порядок строк — как в команде; студенты из табеля, которых нет в команде, идут следом.
  const rows = new Map<number, StudentRow>()
  for (const member of team) {
    rows.set(member.userId, {
      id: String(member.userId),
      firstName: member.meta.firstName,
      lastName: member.meta.lastName,
      role: member.roles?.join(', ') ?? '',
      picture: member.profilePicture,
      hours: Array<number | null>(weekCount).fill(null),
      weeks: Array<WeekCell | null>(weekCount).fill(null)
    })
  }

  for (const grading of gradings) {
    const sprintIndex = ordered.findIndex(s => s.id === grading.sprintId)
    if (sprintIndex < 0) continue

    for (const student of grading.students ?? []) {
      if (!rows.has(student.studentId)) {
        const [firstName = '', ...rest] = student.studentName.split(' ')
        rows.set(student.studentId, {
          id: String(student.studentId),
          firstName,
          lastName: rest.join(' '),
          role: '',
          hours: Array<number | null>(weekCount).fill(null),
          weeks: Array<WeekCell | null>(weekCount).fill(null)
        })
      }
      const row = rows.get(student.studentId)!
      // weekNumber может быть и 1/2 внутри спринта, и сквозным (3/4, 5/6…) — остаток от деления
      // даёт слот в обоих случаях. По порядку класть нельзя: у пришедшего в середине спринта
      // есть только вторая неделя, и она встала бы в первую колонку.
      const weeks = [...(student.weeks ?? [])].sort((a, b) => a.weekNumber - b.weekNumber)
      weeks.slice(0, WEEKS_PER_SPRINT).forEach((week, i) => {
        const slot = week.weekNumber >= 1 ? (week.weekNumber - 1) % WEEKS_PER_SPRINT : i
        row.hours[sprintIndex * WEEKS_PER_SPRINT + slot] = week.hours ?? null
        row.weeks[sprintIndex * WEEKS_PER_SPRINT + slot] = { weekNumber: week.weekNumber, state: week.state }
      })
    }
  }

  // Табель спринта перечисляет тех, кто тогда был в проекте: остальным ставим прочерк,
  // иначе пустая ячейка врала бы, что часы просто забыли выставить.
  for (const grading of gradings) {
    const sprintIndex = ordered.findIndex(s => s.id === grading.sprintId)
    if (sprintIndex < 0) continue
    for (const row of rows.values()) {
      for (let w = 0; w < WEEKS_PER_SPRINT; w++) {
        const i = sprintIndex * WEEKS_PER_SPRINT + w
        if (!row.weeks[i]) row.weeks[i] = { weekNumber: w + 1, state: 'NotInProject' }
      }
    }
  }

  // Куратор есть в команде, но в табеле его нет никогда — строка из одних прочерков не нужна
  const students = [...rows.values()].filter(row =>
    gradings.length === 0 || row.weeks.some(week => week && week.state !== 'NotInProject')
  )
  const viewerIndex = students.findIndex(s => s.id === viewerId)
  if (viewerIndex >= 0) {
    const [viewer] = students.splice(viewerIndex, 1)
    students.unshift({ ...viewer, isViewer: true })
  }

  return {
    sprints: ordered.map(s => ({
      id: s.id,
      isCurrent: s.isCurrent,
      isFuture: s.startDate > today,
      startDate: s.startDate,
      endDate: s.endDate
    })),
    currentWeekIndex,
    students
  }
}

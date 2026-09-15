import type { GradingState } from '@/entities/project'

export interface ScoringSprint {
  id: string
  isCurrent: boolean
  /** Спринт ещё не начался — в шапке иконка часов. */
  isFuture: boolean
  /** YYYY-MM-DD */
  startDate: string
  /** YYYY-MM-DD */
  endDate: string
}

export interface WeekCell {
  /** Как пришло из grading-status — с ним же часы и отправляются. */
  weekNumber: number
  state: GradingState
}

export interface StudentRow {
  id: string
  firstName: string
  lastName: string
  role: string
  picture?: string
  /** Строка текущего пользователя: стоит первой, у имени приписка «(Вы)». */
  isViewer?: boolean
  /** Часы по неделям, строго `sprints.length * 2` элементов. `null` — часы не выставлены. */
  hours: (number | null)[]
  /** Состояние недель, выровнено с `hours`. `null` — табеля по неделе нет (спринт не начался). */
  weeks: (WeekCell | null)[]
}

export interface ScoringModel {
  sprints: ScoringSprint[]
  /** Абсолютный индекс текущей недели (0-based), -1 — сейчас нет активного спринта. */
  currentWeekIndex: number
  students: StudentRow[]
}

import type { GradingState } from '@/entities/project'
import type { Competency } from '@/entities/competency'

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

/** Состояния недели с бэка плюс наше: студента в этот спринт в проекте ещё не было. */
export type WeekState = GradingState | 'NotInProject'

export interface WeekCell {
  /** Как пришло из grading-status — с ним же часы и отправляются. */
  weekNumber: number
  state: WeekState
}

export interface StudentRow {
  id: string
  firstName: string
  lastName: string
  /** Компетенции в проекте через запятую — подпись под именем. */
  role: string
  /** Первая компетенция — по ней выбирается иконка. Нет — человек не на месте в роли. */
  competency?: Competency
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

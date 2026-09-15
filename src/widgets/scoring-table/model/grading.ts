import type { StudentRow } from './types'
import { WEEKS_PER_SPRINT } from './toScoringModel'
import type { GradingState } from '@/entities/project'

/** Неделя — 168 часов, больше выставить нельзя. */
export const MAX_WEEK_HOURS = 168

/** Подсветка поля: серое — выставлено, жёлтое/красное — ждёт оценки, замок — ещё закрыто. */
export type CellTone = 'filled' | 'warning' | 'danger' | 'locked'
export type RowStatus = 'done' | 'warning' | 'danger' | 'pending'

// GradingState по ответу бэка:
//   LockedBeforeMidweek — середина недели не наступила, всё закрыто → замок;
//   Open — ячейки открыты → жёлтое, пока пусто;
//   WarningNeedsGrading — первая неделя спринта кончилась, а оценок нет → красное;
//   DangerNeedsGrading — наступила середина второй недели → красное;
//   Closed — всё закрыто, править нельзя; BlockedOverdue — спринт не закрыт вовремя,
//   оценивание в проекте заблокировано.
// «Выставлено» решает само значение, чтобы введённое, но не сохранённое, сразу гасило подсветку.
export const cellTone = (state: GradingState | undefined, hasValue: boolean): CellTone => {
  if (!state || state === 'LockedBeforeMidweek') return 'locked'
  if (hasValue) return 'filled'
  return state === 'Open' ? 'warning' : 'danger'
}

export const isEditable = (state: GradingState | undefined): boolean =>
  state === 'Open' || state === 'WarningNeedsGrading' || state === 'DangerNeedsGrading'

/** Хоть один спринт не закрыт вовремя — оценивание блокируется во всём проекте. */
export const isGradingBlocked = (students: StudentRow[]): boolean =>
  students.some(student => student.weeks.some(week => week?.state === 'BlockedOverdue'))

export const rowStatus = (tones: CellTone[]): RowStatus => {
  if (tones.includes('danger')) return 'danger'
  if (tones.includes('warning')) return 'warning'
  if (tones.includes('locked')) return 'pending'
  return 'done'
}

/** Хотя бы у одного студента хотя бы одна начавшаяся неделя спринта без часов. */
export const sprintHasGaps = (students: StudentRow[], sprintIndex: number): boolean =>
  students.some(student =>
    Array.from({ length: WEEKS_PER_SPRINT }, (_, w) => sprintIndex * WEEKS_PER_SPRINT + w).some(i => {
      const tone = cellTone(student.weeks[i]?.state, student.hours[i] != null)
      return tone === 'warning' || tone === 'danger'
    })
  )

/** Ключ черновика: спринт, студент и неделя внутри спринта. */
export const draftKey = (sprintIndex: number, studentId: string, week: number) => `${sprintIndex}:${studentId}:${week}`

/**
 * Ввод поля часов: только цифры, без ведущих нулей, не больше недели.
 * `null` — ввод отклоняется и в поле остаётся прежнее значение.
 */
export const parseHoursInput = (raw: string): string | null => {
  const digits = raw.replace(/\D/g, '')
  if (digits === '') return ''
  const hours = Number(digits)
  return hours > MAX_WEEK_HOURS ? null : String(hours)
}

/** Подпись дедлайна: считаем только последние 5 дней спринта. */
export const daysLeftLabel = (daysLeft: number | null, plural: (n: number) => string): string | null => {
  if (daysLeft == null || daysLeft < 0 || daysLeft > 5) return null
  return daysLeft === 0 ? '(последний день)' : `(осталось ${daysLeft} ${plural(daysLeft)})`
}

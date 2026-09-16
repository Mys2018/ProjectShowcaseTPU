import { useEffect, useState } from 'react'
import { useBlocker } from 'react-router-dom'
import clsx from 'clsx'
import styles from './GradingPanel.module.css'
import type { StudentRow } from '../model/types'
import { pluralizeHours, totalHours } from '../model/computations'
import { WEEKS_PER_SPRINT } from '../model/toScoringModel'
import { useProjectScoring } from '../model/useProjectScoring'
import {
  cellTone,
  daysLeftLabel,
  draftKey,
  isEditable,
  isGradingBlocked,
  parseHoursInput,
  rowStatus,
  sprintTone,
  type CellTone,
  type RowStatus
} from '../model/grading'
import { useSubmitSprintHours, type SprintHoursBatch } from '@/entities/project'
import { Avatar, TeamUserCard } from '@/entities/user'
import { CompetencyIcon } from '@/entities/competency'
import { getDaysUntil, getPluralDays, parseDeadline } from '@/shared'
import { useModalStore } from '@/shared/model'
import { GreyButton, OutlineButton } from '@/shared/ui/elements/buttons'
import LockIcon from '@/shared/ui/icons/lock-small.svg?react'
import SheetIcon from '@/shared/ui/icons/sheet.svg?react'
import DoneIcon from '@/shared/ui/icons/round-status-done.svg?react'
import WarningIcon from '@/shared/ui/icons/round-status-warning.svg?react'
import DangerIcon from '@/shared/ui/icons/round-status-danger.svg?react'
import PendingIcon from '@/shared/ui/icons/round-status-pending.svg?react'
import ChangesIcon from '@/shared/ui/icons/round-status-changes.svg?react'

interface GradingPanelProps {
  projectId: string
  title: string
}

const STATUS_ICONS: Record<RowStatus, typeof DoneIcon> = {
  changes: ChangesIcon,
  done: DoneIcon,
  warning: WarningIcon,
  danger: DangerIcon,
  pending: PendingIcon
}

const STATUS_LABELS: Record<RowStatus, string> = {
  changes: 'Часы изменены, но не сохранены',
  done: 'Часы выставлены',
  warning: 'Нужно выставить часы',
  danger: 'Часы просрочены',
  pending: 'Оценивание недели ещё не открыто'
}

/** Черновик: введённые, но не сохранённые часы. Пустая строка — поле очищено. */
type Draft = Record<string, string>

// Лишний символ отсекаем до того, как он попал в поле: если откатывать значение в
// onChange, браузер переносит каретку в начало и следующая цифра встаёт первой.
const rejectInvalidInput = (e: React.FormEvent<HTMLInputElement> & { data?: string }) => {
  const input = e.currentTarget
  if (!e.data) return
  const next = input.value.slice(0, input.selectionStart ?? 0) + e.data + input.value.slice(input.selectionEnd ?? 0)
  if (!/^\d+$/.test(next) || parseHoursInput(next) === null) e.preventDefault()
}

const withoutKey = (draft: Draft, key: string): Draft => {
  const next = { ...draft }
  delete next[key]
  return next
}

/**
 * Оценка участников: часы по неделям выбранного спринта. Ключ `projectId` на
 * компоненте сбрасывает черновик при смене проекта.
 */
export function GradingPanel({ projectId, title }: GradingPanelProps) {
  const { data, isLoading, isError } = useProjectScoring(projectId)
  const submit = useSubmitSprintHours(projectId)
  const [pickedSprint, setPickedSprint] = useState<number | null>(null)
  const [draft, setDraft] = useState<Draft>({})
  const { openModal, closeModal } = useModalStore()

  // Уход со страницы (и переключение вкладки) с несохранёнными часами — общий поп-ап платформы
  const dirty = Object.values(draft).some(value => value !== '')
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      dirty && (currentLocation.pathname !== nextLocation.pathname || currentLocation.hash !== nextLocation.hash)
  )

  useEffect(() => {
    if (blocker.state !== 'blocked') return
    openModal('CONFIRM_CANCEL', {
      title: 'У вас есть несохраненные изменения',
      description: 'Если вы покинете страницу, они будут безвозвратно потеряны. Вы уверены, что хотите уйти?',
      cancelText: 'Покинуть страницу',
      confirmText: 'Вернуться к редактированию',
      onDecline: () => {
        closeModal()
        setDraft({})
        blocker.proceed?.()
      },
      onConfirm: () => {
        closeModal()
        blocker.reset?.()
      }
    })
  }, [blocker, openModal, closeModal])

  if (isLoading) return <p className={styles.state}>Загружаем часы…</p>
  if (isError || !data) return <p className={styles.state}>Не удалось загрузить часы</p>
  if (data.sprints.length === 0) return <p className={styles.state}>Спринтов пока нет</p>

  const { sprints, currentWeekIndex } = data
  // Оцениваем только тех, кто есть в табеле: куратор в команде, но часов у него нет
  const students = data.students.filter(s => s.weeks.some(Boolean))
  const currentSprint = sprints.findIndex(s => s.isCurrent)
  const lastStarted = sprints.findLastIndex(s => !s.isFuture)
  const selected = pickedSprint ?? (currentSprint >= 0 ? currentSprint : Math.max(lastStarted, 0))
  const deadline = currentSprint >= 0 ? sprints[currentSprint].endDate : null
  const blocked = isGradingBlocked(students)
  const readOnly = blocked || submit.isPending

  const savedValue = (student: StudentRow, index: number) => {
    const hours = student.hours[index]
    return hours == null ? '' : String(hours)
  }

  const valueOf = (student: StudentRow, sprintIndex: number, week: number) =>
    draft[draftKey(sprintIndex, student.id, week)] ?? savedValue(student, sprintIndex * WEEKS_PER_SPRINT + week)

  const change = (student: StudentRow, week: number, raw: string) => {
    const next = parseHoursInput(raw)
    if (next === null) return
    const key = draftKey(selected, student.id, week)
    const saved = savedValue(student, selected * WEEKS_PER_SPRINT + week)
    setDraft(d => (next === saved ? withoutKey(d, key) : { ...d, [key]: next }))
  }

  // Стёртое сохранённое значение отправить нельзя (часы обязательны) — возвращаем его.
  const restoreIfEmpty = (student: StudentRow, week: number) => {
    const key = draftKey(selected, student.id, week)
    if (draft[key] === '') setDraft(d => withoutKey(d, key))
  }

  const changes = Object.entries(draft).filter(([, value]) => value !== '')

  const save = () => {
    const batches = new Map<string, SprintHoursBatch>()
    for (const [key, value] of changes) {
      const [sprintIndex, studentId, week] = key.split(':')
      const index = Number(sprintIndex) * WEEKS_PER_SPRINT + Number(week)
      const student = students.find(s => s.id === studentId)
      const cell = student?.weeks[index]
      if (!cell) continue
      const sprintId = sprints[Number(sprintIndex)].id
      const batch = batches.get(sprintId) ?? { sprintId, records: [] }
      batch.records.push({ studentId: Number(studentId), weekNumber: cell.weekNumber, hours: Number(value) })
      batches.set(sprintId, batch)
    }
    submit.mutate([...batches.values()], { onSuccess: () => setDraft({}) })
  }

  const totalWithDraft = (student: StudentRow) =>
    totalHours(
      student.hours.map((_, i) => {
        const value = valueOf(student, Math.floor(i / WEEKS_PER_SPRINT), i % WEEKS_PER_SPRINT)
        return value === '' ? null : Number(value)
      })
    )

  const daysLeft = deadline ? daysLeftLabel(getDaysUntil(deadline), getPluralDays) : null
  const weekNumbers = Array.from({ length: WEEKS_PER_SPRINT }, (_, w) => selected * WEEKS_PER_SPRINT + w + 1)

  return (
    <div className={styles.panel}>
      <section className={styles.summary}>
        <h2 className={styles.title}>Оценка участников «{title}»</h2>
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <p className={styles.label}>Текущий этап</p>
            {currentSprint >= 0 ? (
              <p className={styles.stage}>
                <span className={styles.sprintName}>Спринт {currentSprint + 1}</span>
                <span className={styles.divider} />
                <span className={styles.weekName}>Неделя {currentWeekIndex + 1}</span>
              </p>
            ) : (
              <p className={styles.weekName}>Нет активного спринта</p>
            )}
          </div>
          <div className={styles.metaItem}>
            <p className={styles.label}>Дедлайн</p>
            <p className={styles.deadline}>
              <span className={styles.weekName}>
                {deadline ? parseDeadline(deadline)?.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }) : '—'}
              </span>
              {daysLeft && <span className={styles.daysLeft}>{daysLeft}</span>}
            </p>
          </div>
          {/* Куда ведёт ведомость, пока не решено — ссылка некликабельна */}
          <span className={styles.sheet}>
            <SheetIcon />
            Посмотреть полную ведомость
          </span>
        </div>
      </section>

      <section className={styles.board}>
        <div className={styles.rows}>
          <div className={styles.row}>
            <div className={clsx(styles.grid, styles.head)}>
              <span>Студент</span>
              {weekNumbers.map(n => (
                <span key={n} className={styles.center}>Неделя {n}</span>
              ))}
              <span className={styles.spacer} />
              <span className={styles.statusHead}>Статус</span>
            </div>
            <span className={clsx(styles.resultHead, styles.head)}>Общий результат</span>
          </div>

          {students.map(student => {
            const tones: CellTone[] = []
            const cells = Array.from({ length: WEEKS_PER_SPRINT }, (_, week) => {
              const state = student.weeks[selected * WEEKS_PER_SPRINT + week]?.state
              const value = valueOf(student, selected, week)
              const tone = cellTone(state, value !== '')
              tones.push(tone)

              if (tone === 'locked') {
                return (
                  <span key={week} className={clsx(styles.field, styles.locked)} aria-label="Оценивание недели ещё не открыто">
                    <LockIcon />
                  </span>
                )
              }
              return (
                <label
                  key={week}
                  className={clsx(
                    styles.field,
                    styles[tone],
                    value === '' && styles.empty,
                    // введено, но не сохранено — по макету («New value») число серее
                    value !== '' && draft[draftKey(selected, student.id, week)] !== undefined && styles.unsaved
                  )}
                >
                  <input
                    className={styles.input}
                    inputMode="numeric"
                    maxLength={3}
                    value={value}
                    disabled={readOnly || !isEditable(state)}
                    aria-label={`${student.firstName} ${student.lastName}, неделя ${weekNumbers[week]}`}
                    onFocus={e => e.currentTarget.select()}
                    onBeforeInput={rejectInvalidInput}
                    onChange={e => change(student, week, e.target.value)}
                    onBlur={() => restoreIfEmpty(student, week)}
                  />
                  <span className={styles.unit}>ч</span>
                </label>
              )
            })
            const unsaved = Array.from({ length: WEEKS_PER_SPRINT }, (_, week) => draft[draftKey(selected, student.id, week)])
              .some(value => value !== undefined && value !== '')
            const status = rowStatus(tones, unsaved)
            const StatusIcon = STATUS_ICONS[status]

            return (
              <div key={student.id} className={styles.row}>
                <div className={clsx(styles.grid, styles.card)}>
                  <TeamUserCard
                    firstName={student.firstName}
                    lastName={student.lastName}
                    nameSuffix={student.isViewer && <span className={styles.you}>(Вы)</span>}
                    roles={[student.role]}
                    rolesIcon={
                      <CompetencyIcon competency={{ id: student.role, name: student.role }} className={styles.roleIcon} />
                    }
                    nameStyle="normal"
                    nameTextStyle="bodyText"
                    nameSubtextStyle="OS-12-350"
                    avatar={
                      <span className={styles.avatar}>
                        <Avatar picture={student.picture} fallbackType="user" size="48px" strokeColor="grey" />
                      </span>
                    }
                  />
                  {cells.map(cell => (
                    <div key={cell.key} className={styles.center}>{cell}</div>
                  ))}
                  <span className={styles.spacer} />
                  <span className={styles.status} title={STATUS_LABELS[status]}>
                    <StatusIcon aria-label={STATUS_LABELS[status]} />
                  </span>
                </div>
                <span className={clsx(styles.card, styles.result)}>{pluralizeHours(totalWithDraft(student))}</span>
              </div>
            )
          })}
        </div>

        <footer className={styles.footer}>
          <nav className={styles.sprints} aria-label="Спринты">
            <span className={styles.label}>Спринты:</span>
            <div className={styles.pages}>
              {sprints.map((sprint, i) => {
                const tone = sprint.isFuture ? 'normal' : sprintTone(students, i)
                return (
                  <button
                    key={sprint.id}
                    type="button"
                    disabled={sprint.isFuture}
                    aria-current={i === selected || undefined}
                    data-tone={tone}
                    className={clsx(
                      styles.page,
                      sprint.isCurrent && styles.pageCurrent,
                      !sprint.isCurrent && tone !== 'normal' && styles.pageGaps,
                      i === selected && styles.pageSelected
                    )}
                    onClick={() => setPickedSprint(i)}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </div>
          </nav>

          <div className={styles.actions}>
            {/* ponytail: макета заблокированного состояния нет — пока просто подпись */}
            {blocked && <span className={styles.error}>Оценивание заблокировано: спринт не закрыт вовремя</span>}
            {submit.isError && <span className={styles.error}>Не удалось сохранить часы</span>}
            {Object.keys(draft).length > 0 && (
              <GreyButton textButton="Отменить" className={styles.cancel} disabled={readOnly} onClick={() => setDraft({})} />
            )}
            <OutlineButton
              textButton={submit.isPending ? 'Сохраняем…' : 'Сохранить результат'}
              className={styles.save}
              disabled={changes.length === 0 || readOnly}
              onClick={save}
            />
          </div>
        </footer>
      </section>
    </div>
  )
}

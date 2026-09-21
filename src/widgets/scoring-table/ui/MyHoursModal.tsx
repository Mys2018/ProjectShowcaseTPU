import { useEffect, useId, useRef } from 'react'
import clsx from 'clsx'
import styles from './MyHoursModal.module.css'
import { WEEKS_PER_SPRINT } from '../model/toScoringModel'
import { useDragScroll } from '../model/useDragScroll'
import { useMyProjectHours } from '../model/useMyProjectHours'
import { HScrollbar } from './HScrollbar'
import { getScoreWord } from '@/entities/project'
import { CompetencyIcon, type Competency } from '@/entities/competency'
import { mapDateToLocalString } from '@/shared'
import { Modal } from '@/shared/ui/modals/modal/Modal'
import ClockIcon from '@/shared/ui/icons/round-clock.svg?react'

export interface MyHoursModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  title: string
  competency: Competency
  /** Дедлайн проекта — последняя ключевая точка. Нет — берём конец последнего спринта. */
  deadline?: Date
}

// YYYY-MM-DD как локальная дата: new Date('2026-09-25') даёт полночь по UTC.
const fromDay = (day?: string) => (day ? new Date(`${day}T00:00:00`) : undefined)
const formatDate = (date?: Date) => (date ? mapDateToLocalString(date, { year: true }) : '—')

/** Сводка часов студента по проекту — открывается с карточки проекта в работе или в архиве. */
export function MyHoursModal({ isOpen, onClose, projectId, title, competency, deadline }: MyHoursModalProps) {
  const { data, total, isLoading, isError } = useMyProjectHours(projectId)
  const popupRef = useRef<HTMLElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const dragScroll = useDragScroll()
  const titleId = useId()
  const soonId = useId()

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  // Фокус — в попап, после закрытия — обратно на кнопку, которой его открыли
  useEffect(() => {
    if (!isOpen) return
    const opener = document.activeElement as HTMLElement | null
    popupRef.current?.focus()
    return () => opener?.focus()
  }, [isOpen])

  // Все спринты не влезли — ставим текущую неделю в центр
  useEffect(() => {
    const scroller = scrollRef.current
    const cell = scroller?.querySelector<HTMLElement>('[data-current-week]')
    if (!scroller || !cell) return
    scroller.scrollLeft = cell.offsetLeft - (scroller.clientWidth - cell.offsetWidth) / 2
  }, [data?.currentWeekIndex])

  const sprints = data?.sprints ?? []
  const weekCount = sprints.length * WEEKS_PER_SPRINT
  const weeks = Array.from({ length: weekCount }, (_, i) => i)
  const start = fromDay(sprints[0]?.startDate)
  const end = deadline ?? fromDay(sprints.at(-1)?.endDate)

  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="transparent">
      <section ref={popupRef} tabIndex={-1} className={styles.popup} role="dialog" aria-labelledby={titleId}>
        <div className={styles.content}>
          <header className={styles.header}>
            <h2 id={titleId} className={styles.title}>
              Сводка «{title}»
            </h2>
            <dl className={styles.meta}>
              <div className={styles.metaItem}>
                <dt className={styles.label}>Компетенция:</dt>
                <dd className={clsx(styles.value, styles.competency)}>
                  <CompetencyIcon competency={competency} className={styles.competencyIcon} />
                  <span className={styles.competencyName}>{competency.name}</span>
                </dd>
              </div>
              <div className={styles.metaItem}>
                <dt className={styles.label}>Старт работы:</dt>
                <dd className={styles.value}>{formatDate(start)}</dd>
              </div>
              <div className={styles.metaItem}>
                <dt className={styles.label}>Дедлайн проекта:</dt>
                <dd className={styles.value}>{formatDate(end)}</dd>
              </div>
            </dl>
          </header>

          <div className={styles.hours}>
            <h3 className={styles.subhead}>Ваши часы в проекте</h3>

            {isLoading ? (
              <p className={styles.state}>Загружаем часы…</p>
            ) : isError || !data ? (
              <p className={styles.state}>Не удалось загрузить часы</p>
            ) : weekCount === 0 ? (
              <p className={styles.state}>Спринтов пока нет</p>
            ) : (
              <div>
                <div className={styles.wrap}>
                  <div className={styles.scroll} ref={scrollRef} {...dragScroll}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          {sprints.map((sprint, i) => (
                            <th
                              key={sprint.id}
                              colSpan={WEEKS_PER_SPRINT}
                              className={clsx(styles.sprint, sprint.isCurrent && styles.sprintCurrent)}
                            >
                              <span className={styles.sprintInner}>
                                Спринт {i + 1}
                                {sprint.isFuture && <ClockIcon className={styles.clock} aria-label="Ещё не начался" />}
                              </span>
                            </th>
                          ))}
                        </tr>
                        <tr>
                          {weeks.map(w => (
                            <th
                              key={w}
                              data-current-week={w === data.currentWeekIndex || undefined}
                              // колонки поровну на всю ширину; уже 50px не сжимаются — таблица прокручивается
                              style={{ width: `${100 / weekCount}%` }}
                              className={clsx(styles.week, w === data.currentWeekIndex && styles.current)}
                            >
                              н. {w + 1}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {weeks.map(w => (
                            <td
                              key={w}
                              className={clsx(
                                styles.score,
                                data.absent[w] && styles.absent,
                                w === data.currentWeekIndex && styles.current
                              )}
                              title={data.absent[w] ? 'Вас тогда ещё не было в проекте' : undefined}
                            >
                              {data.absent[w] ? '—' : data.hours[w]}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <HScrollbar target={scrollRef} />
              </div>
            )}

            <div className={styles.note}>
              <span>1 час = 1 балл</span>
              <span className={styles.dispute}>
                Часы проставлены не верно?
                {/* ponytail: спора о часах на бэке пока нет — только подсказка; появится запрос — повесить onClick */}
                <span className={styles.disputeWrap}>
                  <button
                    type="button"
                    className={styles.disputeButton}
                    aria-disabled="true"
                    aria-describedby={soonId}
                  >
                    Оспорить результат
                  </button>
                  <span id={soonId} role="tooltip" className={styles.soon}>
                    Функционал скоро появится
                  </span>
                </span>
              </span>
            </div>
          </div>
        </div>

        <footer className={styles.footer}>
          <p className={styles.total}>
            Общий результат:
            <span className={styles.totalValue}>
              <strong className={styles.totalNumber}>{total ?? '—'}</strong>
              {total !== undefined && getScoreWord(total)}
            </span>
          </p>
          <button type="button" className={styles.close} onClick={onClose}>
            Закрыть таблицу
          </button>
        </footer>
      </section>
    </Modal>
  )
}

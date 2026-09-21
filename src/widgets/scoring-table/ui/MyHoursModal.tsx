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

/** Шаг листания стрелками — примерно один спринт (две недели по 50px). */
const SPRINT_WIDTH = 100
/** Скорость при зажатой стрелке, px/с — спринт за пятую долю секунды. */
const HOLD_SPEED = 500

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
    // Зажатая стрелка: едем с постоянной скоростью, пока не отпустят. Автоповтор клавиши
    // (~30 раз в секунду) запускал бы плавную прокрутку поверх недоигранной — таблица дёргалась.
    let hold: { direction: number; frame: number; last: number } | null = null
    const stopHold = () => {
      if (hold) cancelAnimationFrame(hold.frame)
      hold = null
    }
    const drive = (now: number) => {
      const scroller = scrollRef.current
      if (!hold || !scroller) return
      scroller.scrollLeft += hold.direction * HOLD_SPEED * ((now - hold.last) / 1000)
      hold.last = now
      hold.frame = requestAnimationFrame(drive)
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose()
      // ← → листают таблицу, где бы ни стоял фокус: попап модальный, больше им листать нечего
      const scroller = scrollRef.current
      if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && scroller) {
        e.preventDefault()
        const direction = e.key === 'ArrowLeft' ? -1 : 1
        if (!e.repeat) {
          stopHold()
          scroller.scrollBy({ left: direction * SPRINT_WIDTH, behavior: 'smooth' })
        } else if (!hold || hold.direction !== direction) {
          stopHold()
          const now = performance.now()
          hold = { direction, last: now, frame: requestAnimationFrame(drive) }
        }
        return
      }
      // Tab ходит по кругу внутри попапа — к странице под затемнением не уйти
      const popup = popupRef.current
      if (e.key !== 'Tab' || !popup) return
      const focusable = [...popup.querySelectorAll<HTMLElement>('button, [tabindex="0"]')]
      const first = focusable[0]
      const last = focusable.at(-1)
      if (!first || !last) return
      const active = document.activeElement
      if (e.shiftKey && (active === first || active === popup)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && (active === last || !popup.contains(active))) {
        e.preventDefault()
        first.focus()
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') stopHold()
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', stopHold)
    return () => {
      stopHold()
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', stopHold)
    }
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
      <section ref={popupRef} tabIndex={-1} className={styles.popup} role="dialog" aria-modal="true" aria-labelledby={titleId}>
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
                  {/* полоса прокрутки своя и скрыта от скринридера — листать стрелками можно, сфокусировав область */}
                  <div
                    className={styles.scroll}
                    ref={scrollRef}
                    tabIndex={0}
                    role="region"
                    aria-label="Часы по неделям"
                    {...dragScroll}
                  >
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
                Часы проставлены неверно?
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

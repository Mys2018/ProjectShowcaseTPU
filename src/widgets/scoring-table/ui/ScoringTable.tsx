import { useEffect, useRef } from 'react'
import clsx from 'clsx'
import { useMediaQuery } from 'usehooks-ts'
import styles from './ScoringTable.module.css'
import type { ScoringModel } from '../model/types'
import { pluralizeHours, totalHours } from '../model/computations'
import { WEEKS_PER_SPRINT } from '../model/toScoringModel'
import { useDragScroll } from '../model/useDragScroll'
import { Avatar, TeamUserCard } from '@/entities/user'
import { CompetencyIcon } from '@/entities/competency'
import ClockIcon from '@/shared/ui/icons/round-clock.svg?react'

interface ScoringTableProps {
  model: ScoringModel
}

export function ScoringTable({ model }: ScoringTableProps) {
  const { sprints, currentWeekIndex, students } = model
  const weeks = Array.from({ length: sprints.length * WEEKS_PER_SPRINT }, (_, i) => i)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery('(max-width: 767px)')

  // Центрируем текущую неделю в видимой полосе между залипшими колонками
  // «Участник» и «Результат». Таймер — чтобы замер шёл после раскладки таблицы.
  useEffect(() => {
    const scroller = scrollRef.current
    if (currentWeekIndex < 0 || !scroller) return

    const timer = setTimeout(() => {
      const cell = scroller.querySelector<HTMLElement>('[data-current-week]')
      if (!cell) return
      const widthOf = (cls: string) => scroller.querySelector(`.${cls}`)?.getBoundingClientRect().width ?? 0
      const leftWidth = widthOf(styles.stickyLeft)
      const visibleWidth = scroller.clientWidth - leftWidth - widthOf(styles.stickyRight)
      const cellRect = cell.getBoundingClientRect()
      const cellLeft = cellRect.left - scroller.getBoundingClientRect().left + scroller.scrollLeft
      scroller.scrollLeft = Math.max(0, cellLeft - leftWidth - (visibleWidth - cellRect.width) / 2)
    }, 100)
    return () => clearTimeout(timer)
  }, [currentWeekIndex, isMobile])

  const dragScroll = useDragScroll()

  return (
    <div className={styles.wrap}>
      <div
        className={styles.scroll}
        ref={scrollRef}
        {...dragScroll}
      >
        <table className={styles.table}>
          <thead>
            <tr>
              <th rowSpan={2} className={clsx(styles.head, styles.stickyLeft, styles.participantHead)}>
                Участник проекта
              </th>
              {sprints.map((sprint, i) => (
                <th
                  key={sprint.id}
                  colSpan={WEEKS_PER_SPRINT}
                  className={clsx(styles.head, styles.sprintHead, sprint.isCurrent && styles.sprintCurrent)}
                >
                  <span className={styles.sprintInner}>
                    Спринт {i + 1}
                    {sprint.isFuture && <ClockIcon className={styles.clock} aria-label="Ещё не начался" />}
                  </span>
                </th>
              ))}
              <th rowSpan={2} className={clsx(styles.head, styles.stickyRight, styles.resultHead)}>
                Результат
              </th>
            </tr>
            <tr>
              {weeks.map(w => (
                <th
                  key={w}
                  data-current-week={w === currentWeekIndex || undefined}
                  className={clsx(styles.head, styles.weekHead, w === currentWeekIndex && styles.current)}
                >
                  н. {w + 1}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td className={clsx(styles.stickyLeft, styles.participant)}>
                  <div className={styles.bio}>
                    <TeamUserCard
                      userId={student.id}
                      firstName={student.firstName}
                      lastName={student.lastName}
                      nameSuffix={student.isViewer && <span className={styles.you}>(Вы)</span>}
                      // нет места в роли — строки компетенции нет совсем, а не «?» без подписи
                      roles={student.role ? [student.role] : []}
                      rolesIcon={
                        student.competency && (
                          <CompetencyIcon competency={student.competency} className={styles.roleIcon} />
                        )
                      }
                      nameStyle={isMobile ? 'twoLines' : 'normal'}
                      nameTextStyle={isMobile ? 'OS-12-500' : 'bodyText'}
                      nameSubtextStyle={isMobile ? 'OS-10-400' : 'OS-12-350'}
                      avatar={
                        <Avatar
                          userId={student.id}
                          picture={student.picture}
                          fallbackType="user"
                          size={isMobile ? '36px' : '48px'}
                          strokeColor="grey"
                        />
                      }
                    />
                  </div>
                </td>
                {weeks.map(w => {
                  // прочерк — участника тогда не было в проекте, пусто — часы не выставлены
                  const absent = student.weeks[w]?.state === 'NotInProject'
                  return (
                    <td
                      key={w}
                      className={clsx(styles.score, absent && styles.absent, w === currentWeekIndex && styles.current)}
                      title={absent ? 'Участника тогда ещё не было в проекте' : undefined}
                    >
                      {absent ? '—' : student.hours[w]}
                    </td>
                  )
                })}
                <td className={clsx(styles.stickyRight, styles.result)}>
                  {pluralizeHours(totalHours(student.hours))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

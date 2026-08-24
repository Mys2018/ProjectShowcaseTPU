import { parseDeadline, formatDeadline, getDaysUntil, getPluralDays } from '@/shared/lib/date';
import CalendarIcon from '@/shared/ui/icons/calendar.svg?react';
import CheckIcon from '@/shared/ui/icons/check.svg?react';
import ClockIcon from '@/shared/ui/icons/clock.svg?react'
import styles from './KeyPoints.module.css'
import clsx from "clsx";

interface KeyPoint {
  title: string;
  deadline: string; // DD-MM-YYYY
}

interface KeyPointsProps {
  checkpoints: KeyPoint[];
}

export const KeyPoints = ({ checkpoints }: KeyPointsProps) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const now = today.getTime();

  // Find the first checkpoint that is NOT completed (i.e. deadline is in the future or today)
  const activeIndex = checkpoints.findIndex(kp => {
    const kpDate = parseDeadline(kp.deadline);
    if (!kpDate) return false;
    return kpDate.getTime() >= now;
  });

  // If all are completed, activeIndex will be -1
  const actualActiveIndex = activeIndex === -1 ? checkpoints.length : activeIndex;

  return (
    <div className={styles.keyPoints}>
      <div className={styles.header}>
        <p className={styles.title}>Ключевые точки</p>
        <div className={styles.leftTimeBlock}>
          <CalendarIcon />
          <p className={styles.leftTime}>{'4 месяца'}</p>
        </div>
      </div>

      <div className={styles.listKeyPoints}>
        {checkpoints.map((keyPoint, index) => {
          const isFirst = index === 0
          const isLast = index === checkpoints.length - 1

          // It is completed if it's before the actualActiveIndex
          const isCompleted = index < actualActiveIndex;
          const isActive = index === actualActiveIndex;

          const daysUntil = isActive ? getDaysUntil(keyPoint.deadline) : null
          const showCountdown = daysUntil !== null && daysUntil >= 0 && daysUntil <= 10

          const indexClass = [
            styles.index,
            isFirst ? styles.indexDiamond : '',
            isLast ? styles.indexCircle : '',
            isCompleted ? styles.completedIndex : '',
            isActive ? styles.activeIndex : '',
          ].join(' ')

          return (
            <div key={index} className={`${styles.keyPoint} ${isActive ? styles.keyBodyActive : ''} ${isCompleted ? styles.completed : ''}`}>
              <div className={indexClass}>

                {isActive ? (
                  <div className={styles.clockIcon}>
                    <ClockIcon color={'var(--color-blue)'} />
                  </div>
                ) : (
                  <p className={styles.indexNumber}>
                    {index + 1}
                  </p>)
                }

              </div>


              <div className={styles.keyInfo}>
                <p className={clsx(styles.keyTitle, isActive ? styles.keyTitleActive : '')}>
                  {keyPoint.title}
                </p>
                <p className={styles.keyDeadline}>
                  {isCompleted ? (
                    <span className={styles.completedText}>Завершено  <CheckIcon className={styles.checkIcon} /></span>
                  ) : (
                    <>
                      {formatDeadline(keyPoint.deadline)}
                      {showCountdown && (
                        <span className={styles.countdown}> (через <span className={styles.countdownDays}>{daysUntil} {getPluralDays(daysUntil!)}</span>)</span>
                      )}
                    </>
                  )}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
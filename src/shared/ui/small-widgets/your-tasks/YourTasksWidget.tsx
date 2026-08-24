import { formatDeadline, getDaysUntil, getPluralDays } from '@/shared/lib/date';
import ClockIcon from '@/shared/ui/icons/clock.svg?react'
import { InfoTooltip } from '../../info-tooltip/InfoTooltip';
import type { Activity } from './model/types';
import styles from './YourTasksWidget.module.css'
import CheckIcon from '@/shared/ui/icons/check.svg?react';

type YourTasksWidgetProps = {
  data?: Activity[]
};

const getActivityName = (type: Activity['type']) => {
  switch (type) {
    case 'keyPoint':
      return 'Ключевая точка';
    case 'currentStage':
      return 'Текущий этап';
    case 'upcomingStage':
      return 'Следующий этап';
    case 'completedStage':
      return 'Завершенный этап';
    default:
      return 'Задача';
  }
}


export const YourTasksWidget = ({ data }: YourTasksWidgetProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Ваши задачи</h2>
        <p className={styles.description}>{'Создать единую и надёжную систему уведомлений, которая станет'}</p>
      </div>
      <ul className={styles.taskList}>
        {
          data?.map((activity: Activity, index) => {
            
            const dayUntilDeadline = activity.deadline ? getDaysUntil(activity.deadline) : null
            const showCountdown = dayUntilDeadline !== null && dayUntilDeadline > 0 && dayUntilDeadline <= 7 && activity.type !== 'completedStage'

            const completedStage = activity.type === 'currentStage' && activity.progressCurrentStep === activity.progressSteps

            const isStage = activity.type === 'currentStage' || activity.type === 'upcomingStage' || activity.type === 'completedStage';
            const showFooterDeadlineInfo = isStage && Boolean(activity.deadline);
            const showFooter = (showFooterDeadlineInfo || showCountdown) && activity.status !== 'completed';

            return (
              <li key={index} className={`${styles.taskItem} ${activity.type === 'currentStage' ? styles.currentStage : ''} ${activity.type === 'upcomingStage' ? styles.upcomingStage : ''} ${activity.type === 'completedStage' ? styles.completedStage : ''}`}>
                <div className={styles.taskHeader}>
                  <span className={styles.taskType}>
                    {
                      getActivityName(activity.type)
                    }
                  </span>
                  <span className={styles.extra}>
                    {activity.extra === 'tooltip' && !completedStage && (
                      <InfoTooltip
                        title="Заголовок тултипа"
                        body={
                          [
                            {
                              text: [
                                'Дополнительная информация по задаче',
                              ]
                            },
                          ]
                        }
                        size={'small'}
                        pointer={'bottomRight'}
                        importantText={'Важно тут!'}
                        link={'sdfsdsdsds'}
                        className={styles.infoIconTooltip}
                        type={'help'}
                      />
                    )}
                    {activity.extra === 'all' && !completedStage  && <a href="#" className={styles.allLink}>{"Все>"}</a>}
                    {
                      completedStage && (
                        <div className={styles.completedStage}>
                          Выполнен
                        </div>
                      )
                    }
                  </span>
                </div>
                <div className={`${styles.taskContent} ${activity.status === 'completed' ? styles.completedTask : ''}`}>
                  <div className={`${styles.taskIcon} ${activity.type === 'currentStage' || activity.type === 'upcomingStage' || activity.type === 'completedStage' ? styles.stageIcon : ''}`}>
                    {activity.type === 'keyPoint' && (
                      activity.status !== 'completed' ? <ClockIcon /> : <p className={styles.taskNumber}>{activity.number}</p>
                    )}
                  </div>
                  <div className={styles.taskInfo}>
                    <p className={styles.taskTitle}>{activity.title}</p>
                    {
                      (activity.type === 'currentStage' || activity.type === 'upcomingStage' || activity.type === 'completedStage') && (
                        <div className={styles.progress}>
                          <div className={styles.progressBar}>
                            <div className={styles.progressFill} style={{ width: `${(activity.progressCurrentStep! / activity.progressSteps!) * 100}%` }}></div>
                          </div>
                          <span className={styles.progressText}>
                            {activity.progressCurrentStep}/{activity.progressSteps} {activity.unitType === 'percent' ? '%' : ''}
                          </span>
                        </div>
                      )
                    }
                    {
                      activity.type === 'keyPoint' && activity.deadline && activity.status !== 'completed' &&(
                        <div className={`${styles.deadline} ${showCountdown ? styles.urgentDeadline : ''}`}>
                          {formatDeadline(activity.deadline!)}
                        </div>
                      )
                    }
                    {activity.status === 'completed' && (
                      <div className={styles.completedLabel}>
                        Завершено
                        <CheckIcon className={styles.checkIcon}/>
                      </div>
                    )}
                  </div>
                </div>
                {
                  showFooter && (
                    <div className={styles.taskFooter}>
                      {
                        showFooterDeadlineInfo && (
                          <div className={styles.deadlineContainer}>
                            {
                              activity.type === 'currentStage' && (
                                'Окончание: '
                              )
                            }
                            {
                              activity.type === 'upcomingStage' && (
                                'Ожидание '
                              )
                            }
                            <span className={`${showCountdown ? styles.urgentDeadline : ''}`}>
                              {formatDeadline(activity.deadline!)}
                            </span>
                          </div>
                        )
                      }
                      {
                        showCountdown && (
                          <div className={styles.countdown}>
                            {`через ${dayUntilDeadline} ${getPluralDays(dayUntilDeadline!)}`}
                          </div>
                        )
                      }
                    </div>
                  )
                }
              </li>    
            )
          })
        }
      </ul>
    </div>
  );
};
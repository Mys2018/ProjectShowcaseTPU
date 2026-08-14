import GoIcon from '@/shared/ui/icons/go.svg?react'
import TpuPoint from '@/shared/ui/icons/tpuPoint.svg?react'
import { InfoTooltip } from '@/shared'
import type { ClosingDiscipline } from './model/types'
import styles from './YourPointsWidget.module.css'

type YourPointsWidgetProps = {
  disciplines?: ClosingDiscipline[]
  tpuPoints: number
}

export const YourPointsWidget = ({ disciplines, tpuPoints }: YourPointsWidgetProps) => {
  return (
    <div className={styles.mainContainer}>
      <p className={styles.mainTitle}>Ваши баллы</p>
      <p className={`hidden-mobile ${styles.description}`}>{'Здесь показан прогресс вашего завершения и баллы магазина'}</p>

      <div className={styles.content}>
        <div className={styles.container}>
          <p className={styles.title}>Закрытие дисциплин</p>
          <ul className={styles.disciplinesList}>
            {disciplines?.map(discipline => (
              <li key={discipline.title} className={styles.disciplineItem}>
                <span className={styles.disciplineName}>{discipline.title}</span>
                <div className={styles.progressContainer}>
                  <div className={styles.progressBar}>
                    <span
                      className={styles.progressFill}
                      style={{ width: `${(discipline.currentProgress / discipline.maxProgress) * 100}%` }}
                    />
                  </div>
                  <span className={styles.progressText}>
                    {`${discipline.currentProgress}/${discipline.maxProgress} `}
                    <span className={styles.pointsText}>бал.</span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <InfoTooltip
            title='Заголовок тултипа'
            body={[
              {
                text: ['Информация о закрытии дисциплин']
              }
            ]}
            size={'small'}
            pointer={'topRight'}
            importantText={'Важно тут!'}
            link={'sdfsdsdsds'}
            className={styles.infoTooltip}
            iconClassName={styles.infoIconTooltip}
            type={'help'}
          />
        </div>

        <div className={styles.shop}>
          <div className={styles.shopTitle}>
            <p>
              Магазин <span className='hidden-mobile'>ТПУ</span>
            </p>
            <div className={styles.goIcon}>
              <GoIcon />
            </div>
          </div>
          <div className={styles.pointContainer}>
            {tpuPoints}
            <TpuPoint />
          </div>
        </div>
      </div>
    </div>
  )
}

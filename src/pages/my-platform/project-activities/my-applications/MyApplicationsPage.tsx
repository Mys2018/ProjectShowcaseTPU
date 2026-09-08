import styles from './MyApplicationsPage.module.css'
import { useState } from 'react'
import { BlankPhoto, CrossIcon } from '@/shared'

export function MyApplicationsPage() {
  const [isBannerVisible, setIsBannerVisible] = useState(true) // TODO показывать баннер только до начала рассмотрения
  return (
    <>
      {isBannerVisible && (
        <div className={styles.banner}>
          <button className={styles.closeButton} onClick={() => setIsBannerVisible(false)}>
            <CrossIcon />
          </button>

          <BlankPhoto className={styles.blank} />
          <div className={styles.description}>
            <h3 className={styles.heading}>Ваши заявки скоро посмотрят</h3>
            <p className={styles.paragraph}>
              Дождитесь окончания набора, чтобы наставники смогли приступить к рассмотрению откликов. А пока есть время, вы можете ещё найти
              интересные проекты для подачи заявок.
            </p>
          </div>
          <div className={styles.timer}>
            <p className={styles.paragraph}>Рассмотрение начнётся через</p>
            <div className={styles.badge}>7 дней {/* TODO количество дней до начала рассмотрения */}</div>
          </div>
        </div>
      )}
      <div className={styles.active}>
        <h3 className={styles.title}>Мои отклики</h3>
        <div className={styles.list}>виджет проектов с активным откликом</div>
      </div>
      <div className={styles.archived}>
        <h3 className={styles.title}>История откликов</h3>
        <div className={styles.list}>виджет проектов с архивным откликом</div>
      </div>
    </>
  )
}

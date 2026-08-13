import styles from './GetSaveStatus.module.css'
import ReloadIcon from '@/shared/ui/icons/save.svg?react'
import CheckIcon from '@/shared/ui/icons/new_check.svg?react'
import TimeIcon from '@/shared/ui/icons/hourglass.svg?react'
import NetworkIcon from '@/shared/ui/icons/network.svg?react'
import clsx from "clsx";

export type StatusType = 'save' | 'saving' | 'failed' | 'errorNetwork'

export const getSaveStatus = (statusType: StatusType) => {
  switch (statusType) {
    case 'save':
      return (
        <div className={clsx(styles.statusContainer, styles[statusType])}>
          <ReloadIcon className={styles.icon} />
          <p className={styles.label}>
            Сохранение...
          </p>
        </div>
      )
    case 'saving':
      return (
        <div className={clsx(styles.statusContainer, styles[statusType])}>
          <CheckIcon className={styles.icon} />
          <p className={styles.label}>
            Сохранено
          </p>
        </div>
      )
    case 'failed':
      return (
        <div className={clsx(styles.statusContainer, styles[statusType])}>
          <TimeIcon className={styles.icon} />
          <p className={styles.label}>
            Ошибка сохранения. Повторяем...
          </p>
        </div>
      )
    case 'errorNetwork':
      return (
        <div className={clsx(styles.statusContainer, styles[statusType])}>
          <NetworkIcon className={styles.icon} />
          <p className={styles.label}>
            Нет соединения. Данные не опубликованы
          </p>
        </div>
      )
    default:
  }
}

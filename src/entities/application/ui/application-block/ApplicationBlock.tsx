import type { MouseEvent } from 'react'
import styles from './ApplicationBlock.module.css'

interface ApplicationBlockProps {
  applicationCount: number
  notification: boolean
  onClick: (e: MouseEvent<HTMLElement>) => void
  buttonText: string
}

export const ApplicationBlock = ({ applicationCount, notification, onClick, buttonText }: ApplicationBlockProps) => {
  return (
    <div className={styles.body} onClick={(e) => onClick(e)}>
      <div>
        <p>Отклики:</p>
        <p>{applicationCount}</p>
        {notification && <div className={styles.notification}/>}
      </div>
      <button onClick={(e) => onClick(e)}>{buttonText}</button>
    </div>
  )
}


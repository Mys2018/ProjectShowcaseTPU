import styles from './ApplicationBlock.module.css'

interface ApplicationBlockProps {
  applicationCount: number,
  notification: boolean,
  onClick: () => void,
  buttonText: string,
}

export const ApplicationBlock = ({applicationCount, notification, onClick, buttonText}: ApplicationBlockProps) => {
  return (
    <div className={styles.body}>
      <div>
        <p>Отклики:</p>
        <p>{applicationCount}</p>
        {notification && <div className={styles.notification}/>}
      </div>
      <button onClick={onClick}>{buttonText}</button>
    </div>
  )
}

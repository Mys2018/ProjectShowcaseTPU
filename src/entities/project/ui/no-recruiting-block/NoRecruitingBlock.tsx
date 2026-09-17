import styles from './NoRecruitingBlock.module.css'

export const NoRecruitingBlock = () => {
  return (
    <div className={styles.body}>
      <div className={styles.leftSide}>
        <p>
          К сожалению, набор на проекты завершён :(
        </p>
        <p>
          Приём заявок на текущий поток завершён, а команды уже приступили к работе. Информация о следующем отборе появится здесь позже.
        </p>
      </div>

    </div>
  )
}

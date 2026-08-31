import styles from './NoSuitableProjects.module.css'
import BlankPhoto from '@/shared/assets/blank_photo.jpg'

interface NoSuitableProjectsProps {
  onClear?: () => void
}

export const NoSuitableProjects = ({onClear}: NoSuitableProjectsProps) => {
  return (
    <div className={styles.wrapper}>
      <img className={styles.img} src={BlankPhoto} alt={'Картинка - Нет подходящих проектов'}/>
      <div>
        <h3>
          Нет подходящих проектов
        </h3>
        <button className={styles.clearButton} onClick={onClear}>
          Сбросить все фильтры
        </button>
      </div>
    </div>
  )
}

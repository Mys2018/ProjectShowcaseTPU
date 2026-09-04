import styles from './EditProjectType.module.css'
import PencilIcon from '@/shared/ui/icons/pencil.svg?react'

interface EditProjectTypeProps {
  type: string;
  onClick?: () => void;
}

export const EditProjectType = ({type, onClick}: EditProjectTypeProps) => {
  return (
    <div className={styles.typeContainer}>
      <div>
        <p>
          Тип проекта:
        </p>
        <div>
          {type}
        </div>
      </div>
      <button onClick={onClick}>
        <PencilIcon/>
        Изменить
      </button>
    </div>
  )
}

import styles from "./ProjectStatusLabel.module.css";
import TargetIcon from '@/shared/ui/icons/target.svg?react'

interface ProjectStatusLabelProps {
  status: string
}

export const ProjectStatusLabel = ({status}: ProjectStatusLabelProps) => {
  return (
    <span className={`${styles.status} ${status === 'Active' ? '' : styles.inactive}`}>
      <TargetIcon className={status === 'Active' ? styles.green : styles.red} />
      {status === 'Active' ? 'Набор на проект' : 'Набор закрыт'}
    </span>
  )
}
import styles from './PlusButton.module.css'
import PlusIcon from '@/shared/ui/icons/plus.svg?react'
import clsx from "clsx";

interface PlusButtonProps {
  className?: string
  onClick: () => void
  text: string
}

export const PlusButton = ({className, onClick, text}: PlusButtonProps) => {
  return (
    <button type="button" className={clsx(styles.addButton, className)} onClick={onClick}>
      <span className={styles.plusIcon}><PlusIcon className={styles.plus}/></span>
      {text}
    </button>
  )
}

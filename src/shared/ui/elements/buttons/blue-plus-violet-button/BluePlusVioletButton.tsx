import styles from './BluePlusVioletButton.module.css'
import clsx from "clsx";
import PlusIcon from '@/shared/ui/icons/plus.svg?react'

interface BluePlusVioletButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  textButton?: string;
  className?: string;
}

export const BluePlusVioletButton = ({onClick, textButton, className, disabled}: BluePlusVioletButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(styles.button, className)}
    >
      <PlusIcon className={styles.icon}/>
      {textButton}
    </button>
  )
}

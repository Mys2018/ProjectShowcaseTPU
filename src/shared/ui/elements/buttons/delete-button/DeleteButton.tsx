import styles from './DeleteButton.module.css'
import clsx from "clsx";
import TrashIcon from "@/shared/ui/icons/trash.svg?react"

interface DeleteButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  textButton?: string;
  className?: string;
}

export const DeleteButton = ({onClick, textButton, className, disabled}: DeleteButtonProps) => {
  return (
    <button
      className={clsx(styles.deleteButton, className)}
      onClick={onClick}
      disabled={disabled}
    >
      <TrashIcon />
      {textButton}
    </button>
  )
}

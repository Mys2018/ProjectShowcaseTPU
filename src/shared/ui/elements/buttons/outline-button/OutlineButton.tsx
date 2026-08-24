import styles from './OutlineButton.module.css'
import clsx from "clsx";

interface OutlineButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  textButton?: string;
  className?: string;
}

export const OutlineButton = ({onClick, textButton, className, disabled}: OutlineButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(styles.button, className)}
    >
      {textButton}
    </button>
  )
}

import styles from './GreyButton.module.css'
import clsx from "clsx";
import type {ReactNode} from "react";

interface GreyButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  textButton?: string;
  className?: string;
  children?: ReactNode;
}

export const GreyButton = ({onClick, textButton, className, disabled, children}: GreyButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(styles.button, className)}
    >
      {children}
      {textButton}
    </button>
  )
}

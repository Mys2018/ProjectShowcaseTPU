import type { MouseEventHandler } from 'react';
import styles from './FilledButton.module.css'
import clsx from "clsx";

interface FilledButtonProps {
  onClick?: MouseEventHandler;
  disabled?: boolean;
  textButton?: string;
  className?: string;
}

export const FilledButton = ({onClick, textButton, className, disabled}: FilledButtonProps) => {
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

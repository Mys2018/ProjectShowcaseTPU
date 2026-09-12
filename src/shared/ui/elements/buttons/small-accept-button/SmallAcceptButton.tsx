import styles from './SmallAcceptButton.module.css'
import clsx from "clsx";
import CheckIcon from '@/shared/ui/icons/check.svg?react';

interface SmallAcceptButton {
  onClick?: () => void;
  disabled?: boolean;
  textButton?: string;
  className?: string;
}

export const SmallAcceptButton = ({onClick, textButton, disabled, className}: SmallAcceptButton) => {
  return (
    <button
      className={clsx(styles.button, className)}
      onClick={onClick}
      disabled={disabled}
    >
      <CheckIcon className={styles.backIcon}/>
      {textButton}
    </button>
  )
}

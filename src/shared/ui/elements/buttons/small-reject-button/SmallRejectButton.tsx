import styles from './SmallRejectButton.module.css'
import clsx from "clsx";
import CrossIcon from '@/shared/ui/icons/cross.svg?react';

interface SmallRejectButton {
  onClick?: () => void;
  disabled?: boolean;
  textButton?: string;
  className?: string;
}

export const SmallRejectButton = ({onClick, textButton, disabled, className}: SmallRejectButton) => {
  return (
    <button
      className={clsx(styles.button, className)}
      onClick={onClick}
      disabled={disabled}
    >
      <CrossIcon className={styles.backIcon}/>
      {textButton}
    </button>
  )
}

import styles from './SmallGreenButton.module.css'
import clsx from "clsx";
import BackIcon from '@/shared/ui/icons/back.svg?react';


interface SmallGreenButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  textButton?: string;
  className?: string;
}

export const SmallGreenButton = ({onClick, textButton, disabled, className}: SmallGreenButtonProps) => {
  return (
    <button
      className={clsx(styles.button, className)}
      onClick={onClick}
      disabled={disabled}
    >
      {textButton}
      <BackIcon className={styles.icon}/>
    </button>
  )
}

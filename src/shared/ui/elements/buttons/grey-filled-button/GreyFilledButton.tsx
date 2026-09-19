import styles from './GreyFilledButton.module.css'
import clsx from "clsx";

interface GreyFilledButtonProps {
  buttonText: string,
  onClick?: () => void,
  className?: string,
}

export const GreyFilledButton = ({buttonText, className, onClick}: GreyFilledButtonProps) => {
  return (
    <button className={clsx(styles.button, className)} onClick={onClick}>
      {
        buttonText
      }
    </button>
  )
}

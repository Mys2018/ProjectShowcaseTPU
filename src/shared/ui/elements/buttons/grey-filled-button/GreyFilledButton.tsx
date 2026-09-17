import styles from './GreyFilledButton.module.css'

interface GreyFilledButtonProps {
  buttonText: string,
  onClick?: () => void,
}

export const GreyFilledButton = ({buttonText, onClick}: GreyFilledButtonProps) => {
  return (
    <button className={styles.button} onClick={onClick}>
      {
        buttonText
      }
    </button>
  )
}

import styles from './FooterBlockFields.module.css'
import {FilledButton, GreyButton} from "@/shared/ui/elements/buttons";

type FooterBlockFieldsProps = {
  MIN_LENGTH?: number,
  valueLength?: number,

  isValidSymbol?: boolean,
  isValidAnother?: boolean
  isValid?: boolean,

  disabled?: boolean

  handleCancel?: () => void,
  handleSubmit?: () => void,
  customError?: string,
  showError?: boolean
};

export const FooterBlockFields = ({
   MIN_LENGTH = 100,
   valueLength = 200,
   isValid,
   disabled,
   handleCancel,
   handleSubmit,
   customError,
   showError
}: FooterBlockFieldsProps) => {

  const label = () => {
    if (customError) {
      return <p className={`${styles.footerLabel} ${styles.error}`}>{customError}</p>
    }
    if (valueLength < MIN_LENGTH) {
      return <p className={`${styles.footerLabel} ${showError ? styles.error : ''}`}>Мин: {MIN_LENGTH} символов</p>
    }
    if (isValid) {
      return <p></p>
    }
    return <p></p>
  }

  return (
    <div className={styles.footer}>
      {
        label()
      }
      <div className={styles.buttonContainer}>
        <GreyButton
          onClick={handleCancel}
          textButton={'Отмена'}
        />
        <FilledButton
          onClick={handleSubmit}
          disabled={disabled}
          textButton={'Сохранить изменения'}
        />
      </div>
    </div>
  );
};
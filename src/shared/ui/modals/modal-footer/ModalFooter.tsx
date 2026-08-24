import styles from './ModalFooter.module.css';
import {GreyButton, OutlineButton} from "@/shared/ui/elements/buttons";

interface ModalFooterProps {
  onClose: () => void;
  handleSubmit: () => void;
  selectedValue?: string | null | boolean;
  disabled?: boolean;
  error?: string | null;

  customCloseText?: string,
  customSubmitText?: string
}

export function ModalFooter({ onClose, handleSubmit, selectedValue, disabled, error, customCloseText = 'Отмена', customSubmitText = 'Выбрать и продолжить' }: ModalFooterProps) {
  const isSubmitDisabled = disabled ?? (selectedValue === null || selectedValue === false);

  return (
    <div className={styles.footer}>
      {error ? (
        <span className={styles.errorText}>{error}</span>
      ) : (
        <div />
      )}
      <div className={styles.actions}>
        <GreyButton
         onClick={onClose}
         textButton={customCloseText}
        />

        <OutlineButton
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          textButton={customSubmitText}
        />
      </div>
    </div>
  );
}

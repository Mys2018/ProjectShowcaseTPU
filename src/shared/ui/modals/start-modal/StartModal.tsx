import styles from './StartModal.module.css'
import {Modal} from "@/shared/ui/modals/modal/Modal.tsx";
import {Avatar} from "@/shared/ui/avatar/Avatar.tsx";
import {FilledButton, GreyButton} from "@/shared/ui/elements/buttons";

interface StartModalProps {
  isOpen: boolean;
  onClose: () => void;

  onCancel: () => void;
  onAgree: () => void;

  profilePicture?: string;
}

export const StartModal = ({isOpen, onClose, profilePicture, onCancel, onAgree}: StartModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Body>
        <div className={styles.body}>
          {
            <Avatar picture={profilePicture} className={styles.avatar}/>
          }
          <div className={styles.textContainer}>
            <h2 className={styles.title}>
              Добро пожаловать на платформу ИШИТР+
            </h2>
            <p className={styles.description}>
              Чтобы откликаться на проекты необходимо заполнить базовую информацию: немного о себе и ваши ключевые навыки.
            </p>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <div className={styles.buttons}>
          <GreyButton
            onClick={onCancel}
            textButton={'Заполнить позже'}
          />
          <FilledButton
            onClick={onAgree}
            textButton={'Перейти к заполнению'}
          />
        </div>
      </Modal.Footer>

    </Modal>
  )
}

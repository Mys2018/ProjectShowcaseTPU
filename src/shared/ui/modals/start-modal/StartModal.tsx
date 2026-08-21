import styles from './StartModal.module.css'
import {Modal} from "@/shared/ui/modals/modal/Modal.tsx";
import {Avatar} from "@/shared/ui/avatar/Avatar.tsx";

interface StartModalProps {
  isOpen: boolean;
  onClose: () => void;

  profilePicture?: string;
  goToProfile: () => void;
}

export const StartModal = ({isOpen, onClose, profilePicture, goToProfile}: StartModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Body>
        {
          <Avatar picture={profilePicture} label={'mentor'} className={styles.avatar}/>
        }
        <div className={styles.textContainer}>
          <h3>
            Добро пожаловать на платформу ИШИТР+
          </h3>
          <p>
            Чтобы откликаться на проекты необходимо заполнить базовую информацию: немного о себе и ваши ключевые навыки.
          </p>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <div>

        </div>
      </Modal.Footer>

    </Modal>
  )
}

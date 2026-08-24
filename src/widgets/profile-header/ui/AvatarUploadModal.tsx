import styles from './AvatarUploadModal.module.css';
import { Modal } from '@/shared/ui/modals/modal/Modal';
import {GreyButton, FilledButton} from "@/shared/ui/elements/buttons";

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AvatarUploadModal = ({ isOpen, onClose }: AvatarUploadModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header title="Загрузка аватарки" />
      <Modal.Body>
        <p className={styles.description}>
          Все фотографии профилей синхронизируются с единой системой ТПУ. Чтобы установить новое фото, загрузите его в вашем основном Личном кабинете.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <GreyButton
          onClick={onClose}
          textButton={'Отмена'}
        />
        <FilledButton
          onClick={() => window.open("https://lk.tpu.ru/profile/avatar_editor", "_blank", "noreferrer")}
          textButton={'Перейти в Личный кабинет'}
        />
      </Modal.Footer>
    </Modal>
  );
};

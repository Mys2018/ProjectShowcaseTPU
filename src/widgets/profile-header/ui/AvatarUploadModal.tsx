import { Modal } from '@/shared/ui/modal/Modal';
import styles from './AvatarUploadModal.module.css';

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
        <button className={styles.cancelBtn} onClick={onClose}>
          Отмена
        </button>
        <a href="https://lk.tpu.ru/profile/avatar_editor" target="_blank" rel="noreferrer" className={styles.linkBtn}>
          Перейти в Личный кабинет
        </a>
      </Modal.Footer>
    </Modal>
  );
};

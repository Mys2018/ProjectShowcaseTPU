import styles from './BlockedGradingModal.module.css';
import { Modal } from '@/shared/ui/modals/modal/Modal';
import { FilledButton } from '@/shared/ui/elements/buttons';

export interface BlockedGradingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BlockedGradingModal = ({ isOpen, onClose }: BlockedGradingModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header title="Оценивание заблокировано" />
      <Modal.Body>
        <p className={styles.description}>
          Спринт не был закрыт вовремя, поэтому возможность выставления баллов заблокирована. Для разблокировки оценивания обратитесь к администратору платформы.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <div className={styles.footer}>
          <FilledButton
            textButton="Понятно"
            onClick={onClose}
          />
        </div>
      </Modal.Footer>
    </Modal>
  );
};

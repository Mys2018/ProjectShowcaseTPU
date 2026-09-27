import type { ReactNode } from 'react';
import { Modal } from '@/shared/ui/modals/modal/Modal.tsx';
import BigQuestionIcon from '@/shared/ui/icons/big-question.svg?react';
import { FilledButton, GreyButton } from '@/shared/ui/elements/buttons';
import clsx from 'clsx';
import styles from './ExcludeParticipantModal.module.css';

export interface ExcludeParticipantModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  onDecline?: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  className?: string;
  children?: ReactNode;
}

export const ExcludeParticipantModal = ({
  isOpen = true,
  onClose,
  onConfirm,
  onDecline,
  title = 'Вы собираетесь исключить участника?',
  description = 'Компетенция снова станет свободной, а после публикации изменений проект получит статус «Идёт набор».',
  confirmText = 'Исключить',
  cancelText = 'Отмена',
  className,
  children,
}: ExcludeParticipantModalProps) => {
  const handleCancel = () => {
    if (onDecline) {
      onDecline();
    } else {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Body>
        <div className={clsx(styles.container, className)}>
          <BigQuestionIcon className={styles.questionIcon} />
          <div className={styles.textBlock}>
            <h2 className={styles.title}>{title}</h2>
            {description && <p className={styles.description}>{description}</p>}
          </div>

          <div className={styles.actions}>
            <GreyButton
              onClick={handleCancel}
              textButton={cancelText}
              className={styles.cancelBtn}
            />
            <FilledButton
              onClick={handleConfirm}
              textButton={confirmText}
              className={styles.excludeBtn}
            />
          </div>
          {children}
        </div>
      </Modal.Body>
    </Modal>
  );
};

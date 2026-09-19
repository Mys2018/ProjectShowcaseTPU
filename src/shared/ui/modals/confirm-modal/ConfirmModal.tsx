import { Modal } from '@/shared/ui/modals/modal/Modal.tsx';
import BigQuestionIcon from '@/shared/ui/icons/big-question.svg?react';
import styles from './ConfirmModal.module.css';
import {FilledButton, GreyButton} from "@/shared/ui/elements/buttons";
import type { ReactElement } from 'react';
import clsx from 'clsx';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onDecline: () => void;
  children?: ReactElement
  className?: string
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
  onDecline,
  className,
  children
}: ConfirmModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Body>
        <div className={clsx(styles.container, className)}>
          <BigQuestionIcon className={styles.questionIcon}/>
          <div className={styles.textBlock}>
            <h2 className={styles.title}>{title}</h2>
            {description && <p className={styles.description}>{description}</p>}
          </div>

          
          <div className={styles.actions}>
            <GreyButton
              onClick={onDecline}
              textButton={cancelText}
            />
            <FilledButton
              onClick={onConfirm}
              textButton={confirmText}
              className={styles.confirmBtn}
            />
          </div>
          {children}
        </div>
      </Modal.Body>
    </Modal>
  );
};

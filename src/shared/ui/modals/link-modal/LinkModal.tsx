import styles from './LinkModal.module.css'
import { useEffect, useState } from "react";
import { Modal } from "@/shared/ui/modals/modal/Modal.tsx";
import {DeleteButton, FilledButton, GreyButton} from "@/shared/ui/elements/buttons";

type LinkModalProps = {
  isOpen: boolean,
  onClose: () => void,
  onSubmit: (value: string) => void,
  onDelete: () => void,
  firstValue?: string
  typeLink: string
}

const formatSocialLink = (input: string): string => {
  if (!input) return '';
  if (input === '@') return '@';

  const cleaned = input.replace(/^@+/, '');
  if (!cleaned) return '';

  return `@${cleaned}`;
};

export function LinkModal({ isOpen, onClose, onSubmit, onDelete, firstValue = '', typeLink }: LinkModalProps) {
  const [value, setValue] = useState(() => formatSocialLink(firstValue))

  useEffect(() => {
    setValue(formatSocialLink(firstValue || ''));
  }, [firstValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formatted = formatSocialLink(rawValue);
    setValue(formatted);
  };

  const handleFocus = () => {
    if (!value) {
      setValue('@');
    }
  };

  const handleBlur = () => {
    if (value === '@') {
      setValue('');
    }
  };

  const handleSubmit = () => {
    const finalValue = value === '@' ? '' : value;
    onSubmit(finalValue)
    onClose()
  }

  const handleDelete = () => {
    onDelete()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.SpecialBlock>
        <div className={styles.header}>
          <h3>
            {typeLink}
          </h3>
          <DeleteButton
            onClick={handleDelete}
            textButton={'Удалить'}
          />
        </div>
      </Modal.SpecialBlock>

      <Modal.Body>
        <input
          className={styles.input}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={"@id"}
        />
      </Modal.Body>

      <Modal.Footer>
        <div className={styles.buttonContainer}>
          <GreyButton
            onClick={onClose}
            textButton={'Отмена'}
          />
          <FilledButton
            onClick={handleSubmit}
            disabled={ firstValue === value}
            textButton={'Сохранить изменения'}
          />
        </div>
      </Modal.Footer>
    </Modal>
  )
}
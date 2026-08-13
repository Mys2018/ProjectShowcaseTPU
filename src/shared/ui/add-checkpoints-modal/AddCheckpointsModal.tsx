import styles from './AddCheckpointsModal.module.css'
import DateIcon from '@/shared/ui/icons/date.svg?react';
import {Modal} from "@/shared/ui/modal/Modal.tsx";
import {SmallTextFieldForm} from "@/shared/ui/fields/text-field/TextField.tsx";
import {useRef, useState} from "react";
import {ModalFooter} from "@/shared/ui/modal-footer/ModalFooter.tsx";

interface AddCheckpointsModalProps {
  isOpen: boolean,
  onClose: () => void,
  initialTitle?: string,
  initialDeadline?: string,
  minDate?: string,
  maxDate?: string,
  onConfirm: (title: string, deadline: string) => void
}

export const AddCheckpointsModal = ({isOpen, onClose, initialTitle, initialDeadline, minDate, maxDate, onConfirm }: AddCheckpointsModalProps) => {
  const [value, setValue] = useState(initialTitle || '')
  const [date, setDate] = useState(initialDeadline || 'Дата');
  const [error, setError] = useState<string | undefined>(undefined);

  const dateInputRef = useRef<HTMLInputElement>(null)

  const handleOpenPicker = () => {
    if (dateInputRef.current === null) return
    try {
      dateInputRef.current.showPicker();
    } catch (e) {
      dateInputRef.current.focus();
      console.error(e)
    }
  }

  const handleSubmit = () => {
    if (!value.trim()) {
      setError('Введите название ключевой точки');
      return;
    }
    if (value.length > 500) {
      setError('Максимум 500 символов');
      return;
    }
    if (!date || date === 'Дата') {
      setError('Выберите дату');
      return;
    }

    setError(undefined);
    onConfirm(value, date);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header title={initialTitle ? "Редактирование ключевой точки" : "Новая ключевая точка"}/>
      <Modal.Body>
        <div className={styles.container}>
          <SmallTextFieldForm 
            value={value} 
            maxLength={500}
            validError={error === 'Введите название ключевой точки' || error === 'Максимум 500 символов' ? error : undefined}
            hideErrorText={true}
            onChange={(e) => {
              const val = e.target.value;
              setValue(val);
              if (error === 'Введите название ключевой точки' && val.trim()) {
                setError(undefined);
              } else if (error === 'Максимум 500 символов' && val.length <= 500) {
                setError(undefined);
              }
            }}
          />
          <div className={styles.dateContainer}>
            <div className={styles.labelWrapper}>
              <label className={styles.label}>{date}</label>
            </div>
            <button
              className={styles.inputButton}
              onClick={handleOpenPicker}
            >
              <DateIcon/>
              <input
                ref={dateInputRef}
                className={styles.input}
                type={'date'}
                min={minDate}
                max={maxDate}
                onChange={(e) => {
                  setDate(e.target.value);
                  setError(undefined);
                }}
              />
            </button>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <ModalFooter 
          onClose={onClose} 
          handleSubmit={handleSubmit} 
          customSubmitText={initialTitle ? "Сохранить" : "Добавить"} 
          error={error} 
        />
      </Modal.Footer>
    </Modal>
  )
}

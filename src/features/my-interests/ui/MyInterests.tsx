import styles from './MyInterests.module.css';
import { type ChangeEvent, useState, useEffect } from "react";
import { useUpdateProfileMeta } from '@/entities/user/api/queries';
import Pencil from '@/shared/ui/icons/pencil.svg?react'
import { FooterBlockFields, TextArea } from "@/shared";
import { useModalStore, useProfileEditStore } from '@/shared/model';

type MyInterestsProps = {
  MAX_LENGTH: number;
  MIN_LENGTH: number;
  interests: string,
  className: string
};

export function MyInterests({MAX_LENGTH, MIN_LENGTH, interests, className }: MyInterestsProps) {

  const [value, setValue] = useState<string>(interests || '')
  const [prevValue, setPrevValue] = useState<string>(interests || '')
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [showError, setShowError] = useState<boolean>(false)

  const { setActiveEditBlock, setHasUnsavedChanges } = useProfileEditStore()
  const { openModal, closeModal } = useModalStore()

  const { mutate: updateProfileMeta, isPending } = useUpdateProfileMeta()

  useEffect(() => {
    setValue(interests || '');
    setPrevValue(interests || '');
  }, [interests]);

  const isValidSymbol = value.length >= MIN_LENGTH && value.length <= MAX_LENGTH
  const isValidAnother = true
  const isValid = isValidSymbol && isValidAnother

  const hasUpdate = value.trim() !== (interests || '').trim()
  const disabled = !hasUpdate || isPending

  useEffect(() => {
    if (isEditing) {
      setHasUnsavedChanges(hasUpdate);
    }
  }, [isEditing, hasUpdate, setHasUnsavedChanges]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    if (showError) setShowError(false)
  }

  const handleCancel = () => {
    if (hasUpdate) {
      openModal('CONFIRM_SAVE', {
        title: 'Сохранить изменения?',
        cancelText: 'Удалить',
        confirmText: 'Сохранить',
        onDecline: () => {
          closeModal();
          setIsEditing(false);
          setActiveEditBlock(null);
          setHasUnsavedChanges(false);
          setValue(prevValue);
          setShowError(false);
        },
        onConfirm: () => {
          closeModal();
          handleSubmit();
        }
      });
    } else {
      setIsEditing(false);
      setActiveEditBlock(null);
      setHasUnsavedChanges(false);
      setValue(prevValue);
      setShowError(false);
    }
  }

  const handleSubmit = () => {
    if (!isValid) {
      setShowError(true);
      return;
    }
    if (disabled) return;

    updateProfileMeta(
      { interests: value },
      {
        onSuccess: () => {
          setIsEditing(false);
          setActiveEditBlock(null);
          setHasUnsavedChanges(false);
          setPrevValue(value);
          setShowError(false);
        }
      }
    )
  }

  return (
    <section className={`${styles.body} ${className}`}>
      <div className={styles.mainContainer}>
        <div className={styles.interestsContainer}>
          <h3>
            Мои интересы
          </h3>
          <button
            className={styles.editButton}
            onClick={() => {
              setIsEditing(true)
              setActiveEditBlock('interests')
              setPrevValue(value)
              setShowError(false)
            }}
            disabled={isPending}
          >
            <Pencil />
            Редактировать
          </button>
        </div>
        <TextArea
          value={value}
          maxLength={MAX_LENGTH}
          handleChange={handleChange}
          isDisable={!isEditing || isPending}
          isValid={showError ? isValidSymbol : true}
          isEditing={isEditing}
          placeholder={'Интересующие сферы и задачи, которыми вам нравится заниматься'}
        />
        {
          isEditing && (
            <FooterBlockFields
              MIN_LENGTH={MIN_LENGTH}
              valueLength={value.length}
              isValidSymbol={isValidSymbol}
              isValidAnother={isValidAnother}
              isValid={isValid}
              disabled={disabled}
              handleCancel={handleCancel}
              handleSubmit={handleSubmit}
              showError={showError}
            />
          )
        }
      </div>
    </section>
  );
}

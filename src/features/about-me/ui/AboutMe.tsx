import styles from './AboutMe.module.css';
import Pencil from '@/shared/ui/icons/pencil.svg?react'
import { type ChangeEvent, useState, useEffect } from "react";
import { FooterBlockFields, TextArea } from "@/shared";
import { useUpdateProfileMeta } from '@/entities/user/api/queries';
import { useModalStore, useProfileEditStore } from '@/shared/model';

type AboutMeProps = {
  bio: string,
  className: string
};

export function AboutMe({ bio, className }: AboutMeProps) {
  const MAX_LENGTH = 500
  const MIN_LENGTH = 100

  const [value, setValue] = useState<string>(bio || '')
  const [prevValue, setPrevValue] = useState<string>(bio || '')
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const { setActiveEditBlock, setHasUnsavedChanges } = useProfileEditStore()
  const { openModal, closeModal } = useModalStore()

  const { mutate: updateProfileMeta, isPending } = useUpdateProfileMeta()

  useEffect(() => {
    setValue(bio || '');
    setPrevValue(bio || '');
  }, [bio]);

  const isValidSymbol = value.length >= MIN_LENGTH && value.length <= MAX_LENGTH
  const isValidAnother = true
  const isValid = isValidSymbol && isValidAnother

  const hasUpdate = value.trim() !== (bio || '').trim()
  const disabled = !hasUpdate || !isValid || isPending

  useEffect(() => {
    if (isEditing) {
      setHasUnsavedChanges(hasUpdate);
    }
  }, [isEditing, hasUpdate, setHasUnsavedChanges]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
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
    }
  }

  const handleSubmit = () => {
    if (disabled) return;

    updateProfileMeta(
      { bio: value },
      {
        onSuccess: () => {
          setIsEditing(false);
          setActiveEditBlock(null);
          setHasUnsavedChanges(false);
          setPrevValue(value);
        }
      }
    )
  }

  return (
    <section className={`${styles.body} ${className}`}>
      <div className={styles.mainContainer}>
        <div className={styles.bioContainer}>
          <h3>
            Обо мне
          </h3>
          <button
            className={styles.editButton}
            onClick={() => {
              setIsEditing(true)
              setActiveEditBlock('aboutMe')
              setPrevValue(value)
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
          isValid={isValidSymbol}
          isEditing={isEditing}
          placeholder={'Компетентный опыт, софт-скиллы, ваш подход к работе...'}
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
            />
          )
        }
      </div>
    </section>
  );
}
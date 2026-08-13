import styles from './Portfolio.module.css'
import BackIcon from '@/shared/ui/icons/back.svg?react';
import {useState} from "react";
import {useUpdateProfileMeta} from "@/entities/user/api/queries.ts";

type PortfolioProps = {
  firstValue: string;
  readonly?: boolean;
}

const isValidUrl = (urlString: string) => {
  try {
    new URL(urlString);
    return true;
  } catch {
    return false;
  }
}

export function Portfolio({ readonly, firstValue }: PortfolioProps) {
  const [value, setValue] = useState<string>(firstValue);
  const [savedValue, setSavedValue] = useState<string>(firstValue);
  const [isError, setIsError] = useState(false);

  const { mutate: updateProfileMeta } = useUpdateProfileMeta();

  const isEdit = value !== savedValue;

  const handleSubmit = () => {
    if (!value || !isValidUrl(value)) {
      setIsError(true);
      return;
    }

    setIsError(false);
    setSavedValue(value);

    updateProfileMeta({
      portfolioLink: value
    });
  }

  const handleCancel = () => {
    setValue(savedValue);
    setIsError(false);
  }

  return (
    <div className={styles.container}>
      <h3>Портфолио</h3>
      <div className={styles.body}>
        {!readonly && (
          <p>
            Формат работы на платформе не требует обязательного портфолио, но в борьбе за топовые, реальные и оплачиваемые
            проекты важна каждая деталь. Дополнительное портфолио станет весомым плюсом при рассмотрении вашей кандидатуры
            менеджером проекта и выделит вас на фоне других студентов.
          </p>
        )}
        <div className={styles.validContainer}>
          <label className={isError ? styles.errorState : ''}>
            <input
              type="url"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (isError) setIsError(false)
              }}
              disabled={readonly}
              className={styles.input}
              placeholder="Вставьте ссылку на портфолио"
            />
            {!readonly ? (
              <div className={styles.buttonContainer}>
                {isEdit && (
                  <button className={styles.cancelButton} onClick={handleCancel}>
                    Отмена
                  </button>
                )}

                <button className={styles.saveButton} onClick={handleSubmit} disabled={!isEdit}>
                  Сохранить
                </button>
              </div>
            ) : (
              <button className={styles.saveButton}
                onClick={ () => {
                  window.open(value, '_blank', 'noopener, noreferrer');
                }

                }
              >
                  Посмотреть
                <BackIcon className={styles.backIcon} />
              </button>
            )}
          </label>

          {isError && (
            <p className={styles.errorText}>
              Прикрепите действующую ссылку
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
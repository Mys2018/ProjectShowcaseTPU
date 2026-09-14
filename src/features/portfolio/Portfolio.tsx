import styles from './Portfolio.module.css'
import BackIcon from '@/shared/ui/icons/back.svg?react';
import {useEffect, useState} from "react";
import blankPictureSrc from '@/shared/assets/blank_photo.jpg'
import {useUpdateProfileMeta} from "@/entities/user/api/queries.ts";
import {normalizeExternalUrl} from "@/shared/lib";

type PortfolioProps = {
  firstValue: string;
  readonly?: boolean;
}

export function Portfolio({ readonly, firstValue }: PortfolioProps) {
  const [value, setValue] = useState<string>(firstValue);
  const [savedValue, setSavedValue] = useState<string>(firstValue);
  const [isError, setIsError] = useState(false);

  const { mutate: updateProfileMeta } = useUpdateProfileMeta();

  // useUpdateProfileMeta инвалидирует me()/user(id): после чужих правок
  // профиля придёт новое firstValue — без синхронизации инпут жил бы
  // своей жизнью относительно сервера.
  useEffect(() => {
    setValue(firstValue);
    setSavedValue(firstValue);
  }, [firstValue]);

  const isEdit = value !== savedValue;

  const handleSubmit = () => {
    // Домен без схемы («github.com/user») — законный ввод: нормализуем
    // сами, но javascript:/data: не пропускаем ни в каком виде.
    const normalized = normalizeExternalUrl(value);

    if (!normalized) {
      setIsError(true);
      return;
    }

    setIsError(false);
    setValue(normalized);
    setSavedValue(normalized);

    updateProfileMeta({
      portfolioLink: normalized
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
              name="portfolioLink"
              id="portfolioLink"
              type="url"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (isError) setIsError(false)
              }}
              disabled={readonly}
              className={styles.input}
              placeholder={readonly ? "Портфолио отсутствует" : "Вставьте ссылку на портфолио"}
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
                disabled={!value}
                onClick={ () => {
                  // Значение хранится на бэкенде: не доверяем схеме на рендере.
                  // Старые записи могли остаться без схемы — нормализуем.
                  const normalized = normalizeExternalUrl(value);
                  if (normalized) {
                    window.open(normalized, '_blank', 'noopener, noreferrer');
                  }
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
        {readonly && <img className={styles.image} src={blankPictureSrc} alt={"Картинка портфолио"}/>}
      </div>
    </div>
  )
}
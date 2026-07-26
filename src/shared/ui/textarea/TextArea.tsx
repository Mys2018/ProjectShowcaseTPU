import styles from './TextArea.module.css';
import type {ChangeEvent} from "react";
import clsx from "clsx";

type TextAreaProps = {
  value: string,
  maxLength: number,
  handleChange: (e: ChangeEvent<HTMLTextAreaElement>) => void,
  isDisable: boolean,
  isValid: boolean,
  isEditing?: boolean,
  placeholder: string,
  subtitle?: string
};

export function TextArea({ value, maxLength, handleChange, isDisable, isValid, isEditing = true, placeholder, subtitle }: TextAreaProps) {
  return (
    <div className={`${styles.textContainer} ${isValid ? (isEditing ? styles.edit : styles.validOutline) : styles.errorOutline} `}>
      <div className={styles.innerContainer}>
        {
          subtitle && <p className={clsx(styles.subTitle, isValid ? styles.valid : styles.error)}>
            {subtitle}
          </p>
        }
        <textarea
          value={value}
          onChange={handleChange}
          disabled={isDisable}
          placeholder={placeholder}
        />
      </div>
      <p className={isValid ? styles.valid : styles.error}>
        {value.length} / {maxLength}
      </p>
    </div>
  )
}
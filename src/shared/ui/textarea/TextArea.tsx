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

export function TextArea({ value, maxLength, handleChange, isDisable, isValid, isEditing, placeholder, subtitle }: TextAreaProps) {
  return (
    <div className={`${styles.textContainer} ${!value && styles.yellowBlinking} ${!isValid ? styles.errorOutline : (isEditing ? styles.edit : styles.validOutline)} `}>
      <div className={styles.innerContainer}>
        {
          subtitle && <p className={clsx(styles.subTitle, isValid ? styles.valid : styles.error)}>
            {subtitle}
          </p>
        }
        <textarea
          name="textarea"
          id="textarea"
          value={value}
          onChange={handleChange}
          disabled={isDisable}
          placeholder={placeholder}
        />
      </div>
      {isEditing && <p className={isValid ? styles.valid : styles.error}>
        {value.length} / {maxLength}
      </p>}
    </div>
  )
}
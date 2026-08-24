import styles from './TextArea.module.css';
import type {ChangeEvent} from "react";

type TextAreaProps = {
  value: string,
  maxLength: number,
  handleChange: (e: ChangeEvent<HTMLTextAreaElement>) => void,
  isDisable: boolean,
  isValid: boolean,
  isEditing?: boolean,
  placeholder: string
};

export function TextArea({ value, maxLength, handleChange, isDisable, isValid, isEditing = true, placeholder }: TextAreaProps) {
  return (
    <div className={`${styles.textContainer} ${isValid ? (isEditing ? styles.edit : styles.validOutline) : styles.errorOutline} `}>
      <p className={styles.subTitle}>

      </p>
      <textarea
        name="smallTextarea"
        id="smallTextarea"
        value={value}
        onChange={handleChange}
        disabled={isDisable}
        placeholder={placeholder}
      >
      </textarea>
      <p className={isValid ? styles.valid : styles.error}>
        {value.length} / {maxLength}
      </p>
    </div>
  )
}
import styles from './TextField.module.css'
import {type ChangeEvent, useState} from "react";
import clsx from "clsx";

type BigTextFieldProps = {
  value: string
  subtitle?: string
  placeholder?: string
  maxLength?: number
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
  validError?: string | undefined
}

export const BigTextField = ({value, placeholder, maxLength, onChange, subtitle, validError}: BigTextFieldProps)=>  {

  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={clsx(styles.textContainer, (validError ? styles.error : ''))}>
      <div className={styles.innerContainer}>
        {subtitle && <p className={clsx(styles.subtitle, validError ? styles.error : '')}>
          {subtitle}
        </p>}

        <textarea
          name="text"
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
      {maxLength && <p className={clsx(styles.value, validError ? styles.error : '', isFocused && styles.visible)}>
        {value.length} / {maxLength}
      </p>}
    </div>
  )
}

type SmallTextFieldProps = {
  value: string
  placeholder?: string
  maxLength?: number
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  validError?: string | undefined
  subtitle?: string
}

export const SmallTextField = ({value, placeholder, maxLength, onChange, validError, subtitle}: SmallTextFieldProps)=>  {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={clsx(styles.inputTextContainer, (validError ? styles.error : ''))}>
      <div className={styles.smallInnerContainer}>
        {subtitle && <p className={clsx(styles.subtitle, validError ? styles.error : '')}>
          {subtitle}
        </p>}

        <input
          name="text"
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
      {
        maxLength && <p className={clsx(styles.inputValue, validError ? styles.error : '', isFocused && styles.visible)}>
          {value.length} / {maxLength}
        </p>
      }

    </div>
  )
}

interface BigTextFieldFormProps {
  value: string,
  placeholder?: string,
  maxLength?: number
  subtitle?: string
  title?: string
  validError?: string | undefined,
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void,
}

export const BigTextFieldForm  = ({value, placeholder, maxLength, validError, title, onChange, subtitle} : BigTextFieldFormProps) => {
  return (
    <div className={styles.body}>
      {
        title && <h5 className={styles.title}>
          {title || ''}
        </h5>
      }

      <BigTextField value={value} placeholder={placeholder} maxLength={maxLength} onChange={onChange} subtitle={subtitle} validError={validError}/>
      {validError &&
        <p className={clsx(styles.errorText, styles.error,  styles.errorBlock)}>
          {validError || ''}
        </p>
      }
    </div>
  )
}

interface SmallTextFieldFormProps {
  value: string,
  placeholder?: string,
  maxLength?: number
  subtitle?: string
  title?: string
  validError?: string | undefined,
  hideErrorText?: boolean,
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void,
  children?: React.ReactNode
}

export const SmallTextFieldForm  = ({value, placeholder, maxLength, validError, hideErrorText, title, onChange, children, subtitle} : SmallTextFieldFormProps) => {
  return (
    <div className={styles.body}>
      {
        title && <h5 className={styles.title}>
          {title || ''}
        </h5>
      }

      <div className={styles.iconBody}>
        <SmallTextField value={value} placeholder={placeholder} maxLength={maxLength} onChange={onChange} validError={validError} subtitle={subtitle}/>
        {children}
      </div>
      {validError && !hideErrorText &&
        <p className={clsx(styles.errorText, styles.error, styles.errorBlock)}>
          {validError || ''}
        </p>
      }
    </div>
  )
}

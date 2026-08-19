import type { InputHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Checkbox.module.css';
import CheckIcon from '@/shared/ui/icons/check.svg?react'

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  paddings?: string;
}

export function Checkbox({ label, paddings, className, checked, disabled, ...props }: CheckboxProps) {
  return (
    <label style={{padding: paddings}} className={clsx(styles.wrapper, { [styles.active]: checked, [styles.disabled]: disabled }, className)}>
      <input
        type="checkbox"
        className={styles.visuallyHidden}
        checked={checked}
        disabled={disabled}
        {...props}
      />
      <span className={styles.customCheckbox}>
        <CheckIcon className={styles.checkIcon}/>
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}

import styles from './RadioChip.module.css'
import clsx from "clsx";
import type {InputHTMLAttributes} from "react";

interface RadioChipProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  className?: string;
  checked?: boolean;
  isBlink?: boolean;
}

export const RadioChip = ({ label, className, checked, isBlink, ...props }: RadioChipProps)=> {
  return (
    <label className={clsx(styles.wrapper, { [styles.active]: checked }, isBlink && 'blink-1', className)}>
      <input
        type='radio'
        className={styles.visuallyHidden}
        checked={checked}
        {...props}
      />
      <span className={styles.customRadio} />
      <span className={styles.label}>{label}</span>
    </label>
  )
}

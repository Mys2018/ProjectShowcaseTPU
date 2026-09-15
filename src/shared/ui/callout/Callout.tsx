import clsx from 'clsx'
import type { ComponentPropsWithoutRef } from 'react'
import styles from './Callout.module.css'
import { LightningIcon } from '..'

export function Callout({ className, children, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={clsx(styles.callout, className)} {...props}>
      <LightningIcon className={styles.icon} />
      <p className={styles.text}>{children}</p>
    </div>
  )
}

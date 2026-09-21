import clsx from 'clsx'
import type { ComponentPropsWithRef } from 'react'
import styles from './BlankPhoto.module.css'
import BlankPhotoIcon from '../icons/blank-photo.svg?react'

export function BlankPhoto({ className, children, ...props }: ComponentPropsWithRef<'div'>) {
  return (
    <div className={clsx(styles.blank, className)} {...props}>
      <BlankPhotoIcon className={styles.icon} />
      {children}
    </div>
  )
}

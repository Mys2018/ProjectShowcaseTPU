import type { ComponentPropsWithoutRef } from 'react'
import styles from './PartnerRow.module.css'
import type { Partner } from '../../model/types'
import clsx from 'clsx'

interface PartnerRowProps extends ComponentPropsWithoutRef<'div'> {
  partner: Partner
}

export function PartnerRow({ partner, className, children, onClick, ...props }: PartnerRowProps) {
  return (
    <div className={clsx(styles.partner, onClick && styles.clickable, className)} onClick={onClick} {...props}>
      <img className={styles.picture} src={partner.profilePicture} loading='lazy' />
      <div className={styles.info}>
        <span className={styles.name}>{partner.name}</span>
        <span className={styles.sub}>публикационная активность</span> {/* TODO заменить или убрать */}
      </div>
			{children}
    </div>
  )
}

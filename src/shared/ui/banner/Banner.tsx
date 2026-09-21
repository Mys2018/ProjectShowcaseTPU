import clsx from 'clsx'
import type { ReactElement, ReactNode } from 'react'
import styles from './Banner.module.css'

interface BannerProps {
  title: string
  description?: string

  mainSlot?: ReactElement

  badgeText?: ReactNode
  labelText?: string

  backgroundUrl?: string
  className?: string
  children?: ReactElement
}

/**
 * Баннер. Имеет разную вёрстку в зависимости от того, передан mainSlot или нет
 * 
 @param description Описание, показывается только если передан mainSlot
 @param labelText Показывается перед badgeText если mainSlot не передан
 */
export function Banner({ title, description, mainSlot, badgeText, labelText, backgroundUrl, className, children }: BannerProps) {
  const isExtended = mainSlot !== undefined
  return (
    <div className={clsx(styles.banner, className)} style={{ background: backgroundUrl }}>
      <div className={clsx(styles.hero, isExtended && styles.extended)}>
        <div className={styles.intro}>
          <div className={styles.info}>
            <h3 className={styles.title}>{title}</h3>
            {isExtended && description && <p className={styles.description}>{description}</p>}
          </div>
          <div className={styles.action}>{mainSlot}</div>
        </div>
        <div className={clsx(styles.extra, !children && styles.bottom)}>
          {!isExtended && labelText && <p className={styles.label}>{labelText}</p>}
          {badgeText && <div className={clsx(styles.badge, isExtended && styles.extended)}>{badgeText}</div>}
        </div>
      </div>
      {children}
    </div>
  )
}

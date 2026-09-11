import type { MouseEventHandler, ReactElement, ReactNode } from 'react'
import styles from './Banner.module.css'
import clsx from 'clsx'
import { FilledButton } from '../elements/buttons'

interface BannerProps {
  title: string
  description?: string

  buttonText?: string
  buttonOnClick?: MouseEventHandler

  badgeText?: ReactNode
  labelText?: string

  backgroundUrl?: string
  className?: string
  children?: ReactElement
}

/**
 * Баннер. Имеет разную вёрстку в зависимости от того, передан buttonText или buttonOnClick или нет
 * 
 @param description Описание, показывается только если передан buttonText или buttonOnClick
 @param labelText Показывается перед badgeText если ни buttonText, ни buttonOnClick не были переданы
 */
export function Banner({
  title,
  description,
  buttonText,
  buttonOnClick,
  badgeText,
  labelText,
  backgroundUrl,
  className,
  children
}: BannerProps) {
  const isExtended = buttonText !== undefined || buttonOnClick !== undefined
  return (
    <div className={clsx(styles.banner, className)} style={{ background: backgroundUrl }}>
      <div className={clsx(styles.hero, isExtended && styles.extended)}>
        <div className={styles.intro}>
          <div className={styles.info}>
            <h3 className={styles.title}>{title}</h3>
            {isExtended && description && <p className={styles.description}>{description}</p>}
          </div>
          {isExtended && <FilledButton className={styles.button} textButton={buttonText} onClick={buttonOnClick} />}
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

import clsx from 'clsx'
import type { ReactElement, ReactNode } from 'react'
import StudentMain from '../../assets/3d/Student_main.png'
import ModeratorMain from '../../assets/3d/Moderator_main.png'
import MentorMain from '../../assets/3d/Mentor_main.png'
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

  role?: string
}

const getImage = (role: string ) => {
  switch (role) {
    case 'Student':
      return <img className={styles.student} src={StudentMain} alt="Баннер студента" loading="lazy" decoding="async" />
    case 'Curator':
      return <img className={styles.curator} src={MentorMain} alt="Баннер ментора" loading="lazy" decoding="async" />
    case 'Moderator':
      return <img className={styles.moderator} src={ModeratorMain} alt="Баннер модератора" loading="lazy" decoding="async" />
  }
  return null
}

/**
 * Баннер. Имеет разную вёрстку в зависимости от того, передан mainSlot или нет
 * 
 @param description Описание, показывается только если передан mainSlot
 @param labelText Показывается перед badgeText если mainSlot не передан
 */
export function Banner({ title, description, mainSlot, badgeText, labelText, backgroundUrl, className, children, role }: BannerProps) {
  const isExtended = mainSlot !== undefined
  return (
    <div className={clsx(styles.banner, className)} style={{ background: backgroundUrl }}>
      <div className={clsx(styles.hero, isExtended && styles.extended)}>
        {getImage(role!)}
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
      <div className={clsx(styles.children)}>
        {children}
      </div>

    </div>
  )
}

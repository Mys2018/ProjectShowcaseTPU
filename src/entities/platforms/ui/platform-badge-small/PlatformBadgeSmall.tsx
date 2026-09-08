import styles from './PlatformBadgeSmall.module.css'
import OpenIcon from '@/shared/ui/icons/open.svg?react'

interface PlatformBadgeSmallProps {
  link: string,
  platformName: string,
}

export const PlatformBadgeSmall = ({link, platformName}: PlatformBadgeSmallProps) => {
  return (
    <a
      className={styles.body}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
    >
      {platformName}
      <OpenIcon/>
    </a>
  )
}

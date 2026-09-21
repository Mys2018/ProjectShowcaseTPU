import styles from './PlatformBadgeSmall.module.css'
import OpenIcon from '@/shared/ui/icons/open.svg?react'
import { isSafeExternalUrl } from '@/shared/lib'

interface PlatformBadgeSmallProps {
  link: string,
  platformName: string,
}

export const PlatformBadgeSmall = ({link, platformName}: PlatformBadgeSmallProps) => {
  // Данные приходят с бэкенда: не доверяем схеме на рендере
  const safeLink = isSafeExternalUrl(link) ? link : undefined;

  return (
    <a
      className={styles.body}
      href={safeLink}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
    >
      {platformName}
      <OpenIcon/>
    </a>
  )
}

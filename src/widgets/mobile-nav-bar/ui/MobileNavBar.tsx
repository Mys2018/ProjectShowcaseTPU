import { useLayoutEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import styles from './MobileNavBar.module.css'
import PlatformIcon from '@/shared/ui/icons/nav-platform.svg?react'
import ResearchIcon from '@/shared/ui/icons/nav-research.svg?react'
import { useMobileChrome } from '@/shared/lib'
import { ROUTES } from '@/shared'

export function MobileNavBar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { panelHidden } = useMobileChrome(true, pathname)

  const isCatalog = pathname.startsWith(ROUTES.CATALOG.BASE)
  const isPlatform = pathname.startsWith(ROUTES.MY_PLATFORM.BASE)
  const activeIndex = isCatalog ? 0 : isPlatform ? 1 : -1

  const tabsRef = useRef<(HTMLButtonElement | null)[]>([])
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  // Позицию берём с живого таба, а не считаем по формуле: ширины зависят от
  // экрана, и на узких табы ужимаются.
  useLayoutEffect(() => {
    const tab = tabsRef.current[activeIndex]
    if (!tab) return
    setIndicator({ left: tab.offsetLeft, width: tab.offsetWidth })
  }, [activeIndex, pathname])

  return (
    <nav className={clsx(styles.bar, panelHidden && styles.hidden)}>
      <div className={styles.island}>
        {activeIndex >= 0 && (
          <span
            className={styles.indicator}
            style={{ width: indicator.width, transform: `translateX(${indicator.left}px)` }}
          />
        )}

        <button
          ref={el => { tabsRef.current[0] = el }}
          type="button"
          className={clsx(styles.tab, isCatalog && styles.active)}
          onClick={() => void navigate(ROUTES.CATALOG.BASE)}
        >
          <span className={clsx(styles.icon, styles.iconProjects)} />
          Проекты
        </button>

        <button
          ref={el => { tabsRef.current[1] = el }}
          type="button"
          className={clsx(styles.tab, isPlatform && styles.active)}
          onClick={() => void navigate(ROUTES.MY_PLATFORM.BASE)}
        >
          <span className={clsx(styles.icon, styles.iconPlatform)}>
            <PlatformIcon />
          </span>
          Моя Платформа
        </button>

        {/* TODO: раздела «Исследования» ещё нет ни в роутере, ни в API */}
        <button
          ref={el => { tabsRef.current[2] = el }}
          type="button"
          className={styles.tab}
          disabled
        >
          <span className={clsx(styles.icon, styles.iconResearch)}>
            <ResearchIcon />
          </span>
          Исследования
        </button>
      </div>
    </nav>
  )
}

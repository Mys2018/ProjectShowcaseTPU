import { useLocation, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import styles from './MobileHeader.module.css'
import EnterButton from './EnterButton/EnterButton.tsx'
import { PopUpNavigation } from './pop-up-navigation/PopUpNavigation.tsx'
import { useAuthStore } from '@/entities/user'
// ponytail: ассет как в макете — знак ТПУ, разделитель и чип «ИШИТР +» одной картинкой.
// Школа в нём зашита, из данных пользователя не подставляется.
import LogoTPU from '@/shared/assets/svg/logoTPUMobile.svg'
import HeartIcon from '@/shared/ui/icons/heart.svg?react'
import BellIcon from '@/shared/ui/icons/bell.svg?react'
import { useMobileChrome } from '@/shared/lib'
import { ROUTES } from '@/shared'

export function MobileHeader() {
  const { pathname } = useLocation()
  const { headerTransform, headerAnimate } = useMobileChrome(true, pathname)

  const status = useAuthStore(state => state.status)
  const navigate = useNavigate()

  const isAuthenticated = status === 'authenticated' || status === 'loading'

  const handleLogoClick = () => {
    if (status == 'authenticated') {
      navigate(ROUTES.PROJECTS.RECRUITMENT);
    } else if (status == 'unauthenticated') {
      navigate(ROUTES.PROJECTS.BASE);
    }
  }

  return (
    <header
      className={styles.header}
      style={{
        transform: headerTransform,
        transition: headerAnimate ? 'transform .3s ease' : 'none'
      }}
    >
      <img className={styles.logo} src={LogoTPU} alt="Лого" onClick={handleLogoClick}/>

      {isAuthenticated ? (
        <div className={styles.actions}>
          <div className={styles.icons}>
            <button
              className={clsx(styles.iconButton, styles.heart)}
              aria-label="Понравившиеся проекты"
              onClick={() => void navigate(ROUTES.ACTIVITY.FAVORITES)}
            >
              <HeartIcon />
            </button>
            <button
              className={clsx(styles.iconButton, styles.bell)}
              aria-label="Уведомления"
              onClick={() => {
                navigate(ROUTES.NOTIFICATION.BASE)
              }}
            >
              <BellIcon />
            </button>
          </div>
          <PopUpNavigation />
        </div>
      ) : (
        <EnterButton />
      )}
    </header>
  )
}

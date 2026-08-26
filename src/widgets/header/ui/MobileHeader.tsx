import { useLocation, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import styles from './MobileHeader.module.css'
import EnterButton from './EnterButton/EnterButton.tsx'
import { useAuthStore, useMe } from '@/entities/user'
import { Avatar } from '@/shared/ui/avatar/Avatar.tsx'
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
  const { data: user } = useMe()
  const navigate = useNavigate()

  const isAuthenticated = status === 'authenticated' || status === 'loading'

  return (
    <header
      className={styles.header}
      style={{
        transform: headerTransform,
        transition: headerAnimate ? 'transform .3s ease' : 'none'
      }}
    >
      <img className={styles.logo} src={LogoTPU} alt="Лого" />

      {isAuthenticated ? (
        <div className={styles.actions}>
          <div className={styles.icons}>
            <button
              className={clsx(styles.iconButton, styles.heart)}
              aria-label="Понравившиеся проекты"
              onClick={() => void navigate(ROUTES.MY_PLATFORM.ACTIVITIES.STUDENT.LIKES)}
            >
              <HeartIcon />
            </button>
            {/* ponytail: страницы уведомлений в роутере нет, кнопка без действия */}
            <button className={clsx(styles.iconButton, styles.bell)} aria-label="Уведомления">
              <BellIcon />
            </button>
          </div>
          <Avatar
            className={styles.avatar}
            picture={user?.profilePicture}
            onClick={() => void navigate(ROUTES.PROFILE.BASE)}
          />
        </div>
      ) : (
        <EnterButton />
      )}
    </header>
  )
}

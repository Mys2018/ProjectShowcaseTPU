import {useMediaQuery} from "usehooks-ts";
import styles from "./Header.module.css";
import { MobileHeader } from "./MobileHeader.tsx";
import {useNavigate} from "react-router-dom";
import clsx from "clsx";
import EnterButton from "@/widgets/header/ui/EnterButton/EnterButton.tsx";
import { SwitchWorkSpace } from "@/features/switch-workspace";
import {SwitchMyPlatform} from "@/features/switch-my-platform";
import { useLogout } from "@/features/auth";
import {useAuthStore, useMe} from "@/entities/user";
import {Avatar} from "@/entities/user/ui/avatar";
import { getAvatarRoleInfo } from "@/entities/user";
import HeartIcon from '@/shared/ui/icons/heart.svg?react'
import BellIcon from '@/shared/ui/icons/bell.svg?react'
import {MOBILE_BREAKPOINT} from "@/shared/lib";
import LogoTPU from "@/shared/assets/svg/newLogo.svg";
import {ROUTES} from "@/shared";
import { PopupMenu } from "@/shared/ui/popup-menu/PopupMenu.tsx";
import BellNotiIcon from '@/shared/ui/icons/bell_with_notification.svg?react'
import {useApplications} from "@/entities/application";
import {useMemo} from "react";

export default function Header() {
  const status = useAuthStore(state => state.status);
  const { data } = useMe()
  const { data: invites } = useApplications(
    {
      mode: 'AsStudent',
      type: 'Invitation',
      offset: 0,
      limit: 100,
    },
    status === 'authenticated'
  )

  const activeInvites = useMemo(() => {
    return invites?.applications.filter(item => item.status === 'pending') ?? []
  }, [invites])
  const navigate = useNavigate()
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  const { mutate: logout, isPending: isLogoutPending } = useLogout()

  const handleLogoClick = () => {
    if (status == 'authenticated') {
      navigate(ROUTES.PROJECTS.RECRUITMENT);
    } else if (status == 'unauthenticated') {
      navigate(ROUTES.PROJECTS.BASE);
    }
  }

  if (isMobile) return <MobileHeader/>

  return (
    <div className={styles.headerWrap}>
      <header className={styles.header}>
        <div className={styles.wrap}>
          <img
            className={styles.logo}
            onClick={handleLogoClick}
            src={LogoTPU}
            alt={'Лого'}/>
          <div className={styles.center}>
            <SwitchWorkSpace />
          </div>
          <div className={styles.right}>
            <div className={styles.separator}/>
            <div className={styles.buttonContainer}>
              <button
                className={clsx(styles.iconButton, styles.heart)}
                aria-label="Понравившиеся проекты"
                onClick={() => void navigate(ROUTES.ACTIVITY.FAVORITES)}
              >
                <HeartIcon/>
              </button>
              <button
                className={clsx(styles.iconButton, styles.bell)}
                aria-label="Уведомления"
                onClick={() => {
                  navigate(ROUTES.NOTIFICATION.BASE)
                }}
              >
                {
                  activeInvites && activeInvites.length > 0 ? <BellNotiIcon/> : <BellIcon/>
                }

              </button>
            </div>
            {
              status !== 'authenticated' && status !== 'loading' ?
                <EnterButton/> :
                <PopupMenu
                  trigger={
                    <Avatar
                      picture={data?.profilePicture}
                      label={getAvatarRoleInfo(data?.roles)?.label}
                      labelColor={'black'}
                      fallbackType={getAvatarRoleInfo(data?.roles)?.fallback || 'user'}
                      size={"48px"}
                      strokeColor={"grad"}
                    />
                  }
                >
                  <PopupMenu.Row
                    title={'Мой профиль'}
                    onClick={() => {
                      navigate(ROUTES.PROFILE.BASE);
                    }}
                  />
                  <PopupMenu.Row
                    title={isLogoutPending ? 'Выходим…' : 'Выйти'}
                    onClick={() => {
                      // Уходим на логин только по подтверждённому onSuccess —
                      // при ошибке logout сессия жива, и тихий уход создал бы
                      // «я вышел», под которым остаётся рабочий cookie.
                      logout();
                    }}
                  />
                </PopupMenu>
            }
          </div>
        </div>
      </header>
      <div className={styles.switchWrap}>
          <SwitchMyPlatform />
      </div>

    </div>

  );
}

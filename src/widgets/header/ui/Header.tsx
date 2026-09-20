import {useMediaQuery} from "usehooks-ts";
import styles from "./Header.module.css";
import { MobileHeader } from "./MobileHeader.tsx";
import {useNavigate} from "react-router-dom";
import clsx from "clsx";
import EnterButton from "@/widgets/header/ui/EnterButton/EnterButton.tsx";
import { SwitchWorkSpace } from "@/features/switch-workspace";
import {SwitchMyPlatform} from "@/features/switch-my-platform";
import {useAuthStore} from "@/entities/user";
import HeartIcon from '@/shared/ui/icons/heart.svg?react'
import BellIcon from '@/shared/ui/icons/bell.svg?react'
import {MOBILE_BREAKPOINT} from "@/shared/lib";
import LogoTPU from "@/shared/assets/svg/newLogo.svg";
import {ROUTES} from "@/shared";
import { PopUpNavigation } from "./pop-up-navigation/PopUpNavigation.tsx";

export default function Header() {

  const status = useAuthStore(state => state.status);
  const navigate = useNavigate()
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

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
                <BellIcon/>
              </button>
            </div>
            {
              status !== 'authenticated' && status !== 'loading' ?
                <EnterButton/> :
                <PopUpNavigation />
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

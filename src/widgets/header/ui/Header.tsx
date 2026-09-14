import {useMediaQuery} from "usehooks-ts";
import styles from "./Header.module.css";
import { MobileHeader } from "./MobileHeader.tsx";
import {useNavigate} from "react-router-dom";
import EnterButton from "@/widgets/header/ui/EnterButton/EnterButton.tsx";
import { SwitchWorkSpace } from "@/features/switch-workspace";
import {SwitchMyPlatform} from "@/features/switch-my-platform";
import {useAuthStore, useMe} from "@/entities/user";
import {Avatar} from "@/entities/user/ui/avatar";
import {MOBILE_BREAKPOINT} from "@/shared/lib";
import LogoTPU from "@/shared/assets/svg/newLogo.svg";
import {ROUTES} from "@/shared";
import { getAvatarRoleInfo } from "@/entities/user";
import { useLogout } from "@/features/auth";
import { PopupMenu } from "@/shared/ui/popup-menu/PopupMenu.tsx";

export default function Header() {

  const { data } = useMe()
  const status = useAuthStore(state => state.status);
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
      </header>
      <div className={styles.switchWrap}>
          <SwitchMyPlatform />
      </div>

    </div>

  );
}

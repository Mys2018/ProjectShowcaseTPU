import {useMediaQuery} from "usehooks-ts";
import styles from "./Header.module.css";
import { UserCard } from "./UserCard.tsx";
import { MobileHeader } from "./MobileHeader.tsx";
import {useNavigate} from "react-router-dom";
import { SwitchWorkSpace } from "@/features/switch-workspace";
import {SwitchMyPlatform} from "@/features/switch-my-platform";
import {useAuthStore, useMe} from "@/entities/user";
import { MOBILE_BREAKPOINT } from "@/shared/lib";
import LogoTPU from "@/shared/assets/svg/newLogo.svg";
import {ROUTES} from "@/shared";

export default function Header() {

  const { data } = useMe()
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
          {/*<EnterButton /> */}
          <UserCard profilePicture={data?.profilePicture}/>
        </div>
      </header>
      <div className={styles.switchWrap}>
          <SwitchMyPlatform />
      </div>

    </div>

  );
}

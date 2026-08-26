import {useMediaQuery} from "usehooks-ts";
import styles from "./Header.module.css";
import { UserCard } from "./UserCard.tsx";
import { MobileHeader } from "./MobileHeader.tsx";
import { SwitchWorkSpace } from "@/features/switch-workspace";
import {SwitchMyPlatform} from "@/features/switch-my-platform";
import {useMe} from "@/entities/user";
import { MOBILE_BREAKPOINT } from "@/shared/lib";
import LogoTPU from "@/shared/assets/svg/newLogo.svg";

export default function Header() {

  const { data } = useMe()
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

  if (isMobile) return <MobileHeader />

  return (
    <div className={styles.headerWrap}>
      <header className={styles.header}>
        <div className={styles.wrap}>
          <img src={LogoTPU}  alt={'Лого'}/>
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

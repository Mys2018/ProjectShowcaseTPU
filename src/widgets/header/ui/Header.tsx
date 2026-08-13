import LogoTPU from "@/shared/assets/svg/newLogo.svg";
import { SwitchWorkSpace } from "@/features/switch-workspace";
import styles from "./Header.module.css";

import { UserCard } from "./UserCard.tsx";
import {useMe} from "@/entities/user";

export default function Header() {

  const { data } = useMe()

  return (
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
  );
}

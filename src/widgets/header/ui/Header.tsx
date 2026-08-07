import LogoTPU from "@/shared/assets/svg/newLogo.svg";
import { SwitchWorkSpace } from "@/features/switch-workspace";
import styles from "./Header.module.css";

import { UserCard } from "./UserCard.tsx";
import {useMe} from "@/entities/user";

export default function Header() {

  const { data } = useMe()

  return (
    <div className={styles.header}>
      <header className={styles.wrap}>
        <img src={LogoTPU}  alt={'Лого'}/>
        <div className={styles.center}>
          <SwitchWorkSpace />
        </div>
        {/*<EnterButton /> */}
        <UserCard profilePicture={data?.profilePicture}/>
      </header>
    </div>
  );
}

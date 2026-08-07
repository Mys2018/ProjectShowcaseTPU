import {useAuthStore} from "@/entities/user";
import styles from './UserCard.module.css'
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared/index.ts";
import EnterButton from "@/widgets/header/ui/EnterButton/EnterButton.tsx";
import UserIcon from '@/shared/ui/icons/fallback_personal.svg?react'

interface UserCardProps {
  profilePicture?: string
}

export function UserCard({ profilePicture } : UserCardProps) {
  const status = useAuthStore((s) => s.status);
  const navigate = useNavigate()
  // const { data: user = placeholderUser } = useMe(status === "authenticated");

  if (status !== "authenticated" && status !== "loading") {
    return <EnterButton />;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.avatarContainer} onClick={() => navigate(ROUTES.MY_PROFILE)}>
        {
          profilePicture ?
            <img className={styles.avatar} src={profilePicture} alt="Аватар студента" /> :
            <div className={styles.avatar}>
              <UserIcon className={styles.userIcon}/>
            </div>
        }
        <div className={styles.status}>
          mentor
        </div>
      </div>
    </div>

  );
}

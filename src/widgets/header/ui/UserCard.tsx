import {useAuthStore} from "@/entities/user";
import styles from './UserCard.module.css'
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared/index.ts";
import EnterButton from "@/widgets/header/ui/EnterButton/EnterButton.tsx";
import {Avatar} from "@/shared/ui/avatar/Avatar.tsx";

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
      <Avatar
        picture={profilePicture}
        onClick={() => {
          navigate(ROUTES.MY_PROFILE)
        }}
        label={'mentor'}
      />
    </div>

  );
}

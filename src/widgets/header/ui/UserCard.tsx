import { useNavigate } from 'react-router-dom'
import styles from './UserCard.module.css'
import EnterButton from "@/widgets/header/ui/EnterButton/EnterButton.tsx";
import {useAuthStore, useMe} from '@/entities/user'
import {Avatar} from "@/shared/ui/avatar/Avatar.tsx";
import {getAvatarRoleInfo, ROUTES} from '@/shared'

interface UserCardProps {
  profilePicture?: string
}

export function UserCard({ profilePicture }: UserCardProps) {
  const status = useAuthStore(s => s.status)
  const navigate = useNavigate()
  const { data: user} = useMe();

  if (status !== 'authenticated' && status !== 'loading') {
    return <EnterButton />
  }

  return (
    <div className={styles.profileContainer}>
      <Avatar
        picture={profilePicture}
        onClick={() => {
          navigate(ROUTES.PROFILE.BASE);
        }}
        label={getAvatarRoleInfo(user?.roles)?.label}
        labelColor={'black'}
        fallbackType={getAvatarRoleInfo(user?.roles)?.fallback || 'user'}
        size={"48px"}
        strokeColor={"grad"}
      />
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import styles from './UserCard.module.css'
import EnterButton from '@/widgets/header/ui/EnterButton/EnterButton.tsx'
import { useAuthStore } from '@/entities/user'
import { ROUTES } from '@/shared'

interface UserCardProps {
  profilePicture?: string
}

export function UserCard({ profilePicture }: UserCardProps) {
  const status = useAuthStore(s => s.status)
  const navigate = useNavigate()
  // const { data: user = placeholderUser } = useMe(status === "authenticated");

  if (status !== 'authenticated' && status !== 'loading') {
    return <EnterButton />
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.avatarContainer} onClick={() => void navigate(ROUTES.PROFILE.BASE)}>
        <img className={styles.avatar} src={profilePicture} alt='Аватар студента' />
        <div className={styles.status}>mentor</div>
      </div>
    </div>
  )
}

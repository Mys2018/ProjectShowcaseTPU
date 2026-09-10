import styles from './UserGroup.module.css'
import type { UserBase } from '../../model/types'
import clsx from 'clsx'
import { Avatar } from '../avatar'

interface UserGroupProps {
  users: UserBase[]
  visibleCount?: number
  className?: string
}

export function UserGroup({ users, visibleCount, className }: UserGroupProps) {
  const visibleUsers = users.filter((_, index) => !visibleCount || index < visibleCount)
  const remaining = users.length - visibleUsers.length
  return (
    <div className={clsx(styles.users, className)}>
      {visibleUsers.map(user => (
        <Avatar key={user.id} className={styles.avatar} picture={user.profilePicture} fallbackType='user' size='36px' strokeColor='white' />
      ))}
      {remaining > 0 && <div className={clsx(styles.avatar, styles.remaining)}>+{remaining}</div>}
    </div>
  )
}

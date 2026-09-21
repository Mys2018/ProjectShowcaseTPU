import styles from './UserGroup.module.css'
import type { UserBase, UserCard } from '../../model/types'
import clsx from 'clsx'
import { Avatar } from '../avatar'

interface UserGroupProps {
  users: (UserBase | UserCard)[]
  visibleCount?: number
  className?: string
}

export function UserGroup({ users, visibleCount, className }: UserGroupProps) {
  const visibleUsers = users.filter((_, index) => !visibleCount || index < visibleCount)
  const remaining = users.length - visibleUsers.length
  return (
    <div className={clsx(styles.users, className)}>
      {visibleUsers.map((user, index) => {
        const id = 'userId' in user ? user.userId : user.id
        return (
          <Avatar
            key={id ?? index}
            className={styles.avatar}
            picture={user.profilePicture || ''}
            fallbackType='user'
            size='36px'
            strokeColor='white'
          />
        )
      })}
      {remaining > 0 && <div className={clsx(styles.avatar, styles.remaining)}>+{remaining}</div>}
    </div>
  )
}

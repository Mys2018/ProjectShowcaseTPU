import styles from './UserRow.module.css'
import type { ComponentPropsWithoutRef } from 'react'
import type { User } from '../../model/types'

interface UserRowProps extends ComponentPropsWithoutRef<'div'> {
  user: User
}

export function UserRow({ user, className, children, ...props }: UserRowProps) {
  const competenciesNames = user.meta.skills.map(s => s.roleTypeName)
  return (
    <div className={`${styles.container} ${className ?? ''}`} {...props}>
      <img className={styles.avatar} src={user.profilePicture} alt='Фото профиля' />
      <div className={styles.info}>
        <h2 className={styles.name}>{user.meta.name}</h2>
        <p className={styles.competencies}>{competenciesNames.join(", ")}</p>
      </div>
      {children}
    </div>
  )
}

import styles from './UserRow.module.css'
import type { ComponentPropsWithoutRef } from 'react'
import type { User } from '../../model/types'
import {useNavigate} from "react-router-dom";
import { buildRoute, ROUTES } from "@/shared";

interface UserRowProps extends ComponentPropsWithoutRef<'div'> {
  user: User
}

export function UserRow({ user, className, children, ...props }: UserRowProps) {
  const navigate = useNavigate()

  const competenciesNames = user.meta.skills.map(s => s.roleTypeName)

  const handleRowClick = () => {
    if (user.id) {
      navigate(buildRoute.profileById(String(user.id)))
    } else {
      navigate(ROUTES.PROFILE.BASE)
    }
  }

  return (
    <div className={`${styles.container} ${className ?? ''}`} onClick={handleRowClick} {...props} >
      <img className={styles.avatar} src={user.profilePicture} alt='Фото профиля' loading="lazy" decoding="async" />
      <div className={styles.info}>
        <h2 className={styles.name}>{user.meta.name}</h2>
        <p className={styles.competencies}>{competenciesNames.join(", ")}</p>
      </div>
      {children}
    </div>
  )
}

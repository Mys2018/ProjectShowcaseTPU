import styles from './Avatar.module.css'
import clsx from "clsx";
import UserIcon from "@/shared/ui/icons/fallback_personal.svg?react";

interface AvatarProps {
  picture?: string,
  className?: string,
  label?: string,
  onClick?: () => void,
}

export const Avatar = ({picture, className, label, onClick}: AvatarProps) => {
  return (
    <div className={clsx(styles.avatarContainer, className)} onClick={onClick}>
      {
        picture ?
          <img className={styles.avatar} src={picture} alt="Аватар студента" /> :
          <div className={styles.avatar}>
            <UserIcon className={styles.userIcon}/>
          </div>
      }
      {label && (
        <div className={styles.status}>
          {label}
        </div>
      )}
    </div>
  )
}

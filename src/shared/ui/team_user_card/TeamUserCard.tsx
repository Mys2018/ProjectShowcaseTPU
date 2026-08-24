import styles from './TeamUserCard.module.css'
import UserIcon from '@/shared/ui/icons/fallback_personal.svg?react'

interface TeamUserCardProps {
  profilePicture?: string,
  name?: string,
  course?: string,
  roles?: string[],
  avatar_size?: '40px' | '48px',
}

export const TeamUserCard = ({profilePicture, course, name, roles, avatar_size}: TeamUserCardProps) => {
  return (
    <div className={styles.leftHalf}>
      {
        profilePicture ?
          <img className={styles.avatar} style={{width: avatar_size, height: avatar_size}} src={profilePicture} alt="Аватар студента" /> :
          <div className={styles.avatar} style={{width: avatar_size, height: avatar_size}}>
            <UserIcon className={styles.userIcon}/>
          </div>
      }
      <div className={styles.infoBlock}>
        <p className={styles.name}>
          {name}
        </p>
        <div className={styles.moreInfo}>
          <p>
            {course} курс
          </p>
          <div className={styles.verticalSeparator}/>
          <p>
            {roles?.join(', ')}
          </p>
        </div>
      </div>
    </div>
  )
}

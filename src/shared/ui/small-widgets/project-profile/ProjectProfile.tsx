import styles from './ProjectProfile.module.css'
import UserIcon from '@/shared/ui/icons/fallback_personal.svg?react'

type ProjectProfileProps = {
  name?: string;
  role?: string;
  avatarSrc?: string;
};

export const ProjectProfile = ({ name, role, avatarSrc}: ProjectProfileProps) => {

  return (
    <div className={styles.container}>
      {
        avatarSrc ?
          <img className={styles.avatar} src={avatarSrc} alt="Аватар студента" /> :
          <div className={styles.avatar}>
            <UserIcon className={styles.userIcon}/>
          </div>
      }
      <div className={styles.info}>
        <h2 className={styles.name}>{name}</h2>
        <p className={styles.role}>{role}</p>
      </div>
    </div>
  );
};
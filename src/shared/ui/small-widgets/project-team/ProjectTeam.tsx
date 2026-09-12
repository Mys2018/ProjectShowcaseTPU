/* eslint-disable fsd/forbidden-imports */
import styles from './ProjectTeam.module.css'
import CheckIcon from '@/shared/ui/icons/check.svg?react';
import PersonFallbackIcon from '@/shared/ui/icons/fallback_personal.svg?react';


export type ProjectTeamItem = {
  id?: number | string,
  name: string,
  role: string,
  avatarSrc?: string,
};

type ProjectTeamProps = {
  list: ProjectTeamItem[],
  openFreeCompetency?: () => void,
  isLoading?: boolean,
};

export const ProjectTeam = (props: ProjectTeamProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Команда проекта</h3>
        <p className={styles.description}>
          Текущий состав участников, которые реализуют этот проект
        </p>
      </div>

      <div className={styles.listWrap}>
        {props.isLoading ? (
          <div className={styles.empty}>Загрузка участников...</div>
        ) : props.list.length === 0 ? (
          <div className={styles.empty}>Команда пока формируется</div>
        ) : (
          <ul className={styles.teamList}>
            {
              props.list.map((item, i) => {
                return (
                  <li key={item.id ?? i} className={styles.item}>
                    <p className={styles.role}>
                      {item.role}
                    </p>
                    <div className={styles.info}>
                      {item.avatarSrc ?
                        <img className={styles.avatar} src={item.avatarSrc} alt={item.name} /> :
                        <PersonFallbackIcon className={styles.fallbackIcon}/>
                      }
                      <p className={styles.name}>
                        {item.name}
                      </p>
                    </div>
                    <CheckIcon className={styles.checkIcon}/>
                  </li>
                )
              })
            }
          </ul>
        )}
        <div className={styles.addBlock}>
          <p>
            Места в команде ещё свободны. Выберите свою компетенцию!
          </p>
          <button onClick={props.openFreeCompetency}>
            Выбрать
          </button>
        </div>
      </div>
    </div>
  );
};
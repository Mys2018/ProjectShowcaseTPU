import styles from './ProjectTeam.module.css'
import {
  Avatar,
  getAvatarRoleInfo,
  getMemberRoleName,
  TeamUserCard,
  type UserCard,
  useMe,
  useUserById,
} from '@/entities/user'
import { type ProjectCardData } from '@/entities/project'
import CheckIcon from '@/shared/ui/icons/check.svg?react'

type ProjectTeamProps = {
  project?: ProjectCardData
  list: UserCard[]
  openFreeCompetency?: () => void
  isLoading?: boolean
}

/** Строка участника: UserCard с /team без grade — курс берём из полного профиля. */
const ProjectTeamMemberRow = ({
  item,
  project,
}: {
  item: UserCard
  project?: ProjectCardData
}) => {
  const { data: fullUser } = useUserById(item.userId)
  const course = fullUser?.grade ?? item.grade
  const roleName = getMemberRoleName(item.userId, project)

  return (
    <li className={styles.item}>
      <p className={styles.role}>{roleName}</p>
      <div className={styles.info}>
        <TeamUserCard
          userId={item.userId}
          avatar={
            <Avatar
              userId={item.userId}
              picture={fullUser?.profilePicture || item.profilePicture}
              fallbackType={getAvatarRoleInfo(fullUser?.roles ?? item.roles)?.fallback || 'user'}
              size={'36px'}
              strokeColor={'grey'}
            />
          }
          firstName={fullUser?.meta.firstName || item.meta.firstName}
          lastName={fullUser?.meta.lastName || item.meta.lastName}
          nameTextStyle={'OS-12-500'}
          nameSubtextStyle={'OS-10-400'}
          nameStyle={'normal'}
          course={course}
        />
      </div>
      <CheckIcon className={styles.checkIcon} />
    </li>
  )
}

export const ProjectTeam = (props: ProjectTeamProps) => {
  const { data: me } = useMe()
  const myUserId = me ? Number(me.id) : null

  const isInTeam = !!(myUserId && props.project && (
    props.project.roles?.some(r => r.placeUserIds?.includes(myUserId)) ||
    props.project.ownerId === myUserId ||
    props.list.some(u => u.userId === myUserId)
  ))

  const hasFreePlaces = props.project?.roles
    ? props.project.roles.some(r => {
        const taken = r.placeUserIds?.length ?? r.places ?? 0
        return r.placesCount - taken > 0
      })
    : true

  const canShowAddBlock = !isInTeam && hasFreePlaces

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Команда проекта</h3>
        <p className={styles.description}>
          Утверждённый состав участников, реализующих проект
        </p>
      </div>

      <div className={styles.listWrap}>
        {props.isLoading ? (
          <div className={styles.empty}>Загрузка участников...</div>
        ) : props.list.length === 0 ? (
          <div className={styles.empty}>Команда пока формируется</div>
        ) : (
          <ul className={styles.teamList}>
            {props.list.map((item, i) => (
              <ProjectTeamMemberRow
                key={item.userId ?? i}
                item={item}
                project={props.project}
              />
            ))}
          </ul>
        )}
        {canShowAddBlock && (
          <div className={styles.addBlock}>
            <p>
              Места в команде ещё свободны. Выберите свою компетенцию!
            </p>
            <button onClick={props.openFreeCompetency}>
              Выбрать
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

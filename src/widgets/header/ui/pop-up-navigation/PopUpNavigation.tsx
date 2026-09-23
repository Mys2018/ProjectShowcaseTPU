import { createPortal } from 'react-dom'
import { useState } from 'react'
import clsx from 'clsx'
import { useMediaQuery } from 'usehooks-ts'
import { Link, NavLink, useLocation } from 'react-router-dom'
import styles from './PopUpNavigation.module.css'
import { useLogout } from '@/features/auth'
import {
  Avatar,
  getAvatarRoleInfo,
  getSwitchableRoles,
  TeamUserCard,
  useMe,
  UserRowSkeleton,
  type UserSwitchableRole
} from '@/entities/user'
import { assertNever, ChevronRightIcon, MOBILE_BREAKPOINT, PopupMenu, QuestionIcon, ROUTES } from '@/shared'

type RoleSection = {
  id: string
  title: string
  subSections: {
    title: string
    route: string
    notification?: {
      isActive: boolean
      count?: number
    }
  }[]
}

const getRoleSection = (roleType: UserSwitchableRole['type']): RoleSection => {
  switch (roleType) {
    case 'Student':
      return {
        id: 'project-activities',
        title: 'Проектная деятельность',
        subSections: [
          { title: 'Мои проекты', route: ROUTES.ACTIVITY.MY_PROJECTS },
          { title: 'Мои отклики', route: ROUTES.ACTIVITY.MY_APPLICATIONS },
          { title: 'Понравившиеся', route: ROUTES.ACTIVITY.FAVORITES }
        ]
      }
    case 'Curator':
      return {
        id: 'project-management',
        title: 'Управление проектами',
        subSections: [
          { title: 'Все проекты', route: ROUTES.MANAGE.PROJECTS },
          { title: 'Отклики и команда', route: ROUTES.MANAGE.PROJECTS },
          { title: 'Оценка участников', route: ROUTES.MANAGE.GRADES }
        ]
      }

    case 'Moderator':
      return {
        id: 'moderation',
        title: 'Модерация',
        subSections: [
          { title: 'Модерация проектов', route: ROUTES.MODERATION.PROJECTS },
          { title: 'Входящие жалобы', route: ROUTES.MODERATION.COMPLAINTS }
        ]
      }

    default:
      return assertNever(roleType)
  }
}

export function PopUpNavigation() {
  const location = useLocation()
  const { mutate: logout, isPending: isLogoutPending } = useLogout()

  const { data: me } = useMe()
  const switchableRoles = getSwitchableRoles(me ? me.roles : []).toReversed()

  const isExtended = switchableRoles.some(role => role.type !== 'Student')
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  const [open, setOpen] = useState(false)

  const trigger = (
    <Avatar
      picture={me?.profilePicture}
      label={getAvatarRoleInfo(me?.roles)?.label}
      labelColor={'black'}
      fallbackType={getAvatarRoleInfo(me?.roles)?.fallback || 'user'}
      size={isMobile ? '36px' : '48px'}
      strokeColor={'grad'}
    />
  )

  const content = (
    <>
      {me ? (
        <Link to={ROUTES.PROFILE.BASE} className={clsx(styles.link, styles.header)}>
          <TeamUserCard
            avatar={<Avatar fallbackType={'user'} size={'40px'} strokeColor={'white'} />}
            firstName={me.meta.firstName}
            lastName={me.meta.lastName}
            nameTextStyle={'ALS'}
            nameSubtextStyle={'OS-10-400'}
            nameStyle={'normal'}
            roles={me.competencies}
          />
        </Link>
      ) : (
        <UserRowSkeleton className={styles.header} />
      )}
      <div className={styles.body} data-chrome-ignore="true">
        {switchableRoles.map(role => {
          const section = getRoleSection(role.type)
          return (
            <div key={section.id} className={styles.section}>
              <div className={clsx(styles.head, styles[role.type], isExtended && styles.extended)}>
                <p className={styles.title}>{section.title}</p>
              </div>
              {section.subSections.map(subSection => {
                const notification = subSection.notification
                let count = notification?.count
                if (count && count >= 100) count = undefined
                const isActive = location.pathname + location.hash === subSection.route
                return (
                  <NavLink
                    to={subSection.route}
                    key={subSection.title}
                    className={clsx(styles.subSection, styles.link, isActive && styles.active)}
                  >
                    <span className={styles.icon} />
                    <p className={styles.title}>{subSection.title}</p>
                    {notification?.isActive && <span className={clsx(styles.notification, count && styles.numeric)}>{count}</span>}
                  </NavLink>
                )
              })}
            </div>
          )
        })}

        <div className={styles.section}>
          <div className={clsx(styles.head, styles['Default'])}>
            <p className={styles.title}>Проекты</p>
          </div>
          <NavLink
            to={ROUTES.PROJECTS.RECRUITMENT}
            className={clsx(
              styles.subSection,
              styles.link,
              location.pathname + location.hash === ROUTES.PROJECTS.RECRUITMENT && styles.active
            )}
          >
            <span className={styles.icon} />
            <p className={styles.title}>Набор</p>
          </NavLink>
          <NavLink
            to={ROUTES.PROJECTS.IN_PROGRESS}
            className={clsx(
              styles.subSection,
              styles.link,
              location.pathname + location.hash === ROUTES.PROJECTS.IN_PROGRESS && styles.active
            )}
          >
            <span className={styles.icon} />
            <p className={styles.title}>В работе</p>
          </NavLink>
        </div>
      </div>
      <div className={styles.footer}>
        <span className={styles.divider} />
        <div className={styles.actions}>
          <button className={styles.button}>
            <QuestionIcon className={styles.icon} />
            <p className={styles.label}>Помощь</p>
          </button>
          {isMobile && (
            <button className={styles.exitButton} onClick={() => setOpen(false)}>
              <ChevronRightIcon className={styles.icon} />
            </button>
          )}
          <button className={styles.button} onClick={() => logout()}>
            <p className={styles.label}>{isLogoutPending ? 'Выходим...' : 'Выйти'}</p>
          </button>
        </div>
      </div>
    </>
  )

  if (isMobile) {
    return (
      <>
        <div className={styles.trigger} onClick={() => setOpen(v => !v)}>
          {trigger}
        </div>
        {open &&
          createPortal(
            <div
              className={clsx(styles.popUp, isExtended && styles.extended, styles.mobile)}
              onClick={() => setOpen(false)}
            >
              {content}
            </div>,
            document.body
          )}
      </>
    )
  }

  return (
    <PopupMenu
      popupClassName={clsx(styles.popUp, isExtended && styles.extended)}
      trigger={trigger}
    >
      {content}
    </PopupMenu>
  )
}

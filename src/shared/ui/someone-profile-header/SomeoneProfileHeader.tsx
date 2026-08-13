import styles from './SomeoneProfileHeader.module.css'
import type {User} from "@/entities/user";
import UserIcon from '@/shared/ui/icons/fallback_personal.svg?react'
import TgLogo from '@/shared/ui/icons/telegram.svg?react'
import ElementLogo from '@/shared/ui/icons/white_element.svg?react'
import VkLogo from '@/shared/ui/icons/vk.svg?react'
import CopyLogo from '@/shared/ui/icons/copy.svg?react'
import OpenLogo from '@/shared/ui/icons/open.svg?react'
import MailLogo from '@/shared/ui/icons/email.svg?react'
import MoreLogo from '@/shared/ui/icons/more.svg?react'
import clsx from "clsx";
import {getStatuses} from "@/shared/ui/statuses/getStatuses.tsx";

type linkType = 'tg' | 'vk' | 'element'

interface ProfileLink {
  type?: linkType;
  link?: string;
  anotherType?: string;
}

const getLogo = (type: linkType | undefined) => {
  switch (type) {
    case 'tg':
      return <TgLogo className={`${styles.logo}`}/>
    case 'vk':
      return <VkLogo className={`${styles.logo}`}/>
    case 'element':
      return <ElementLogo className={`${styles.logo} ${styles.tpu}`}/>
    default:
      return
  }
}

type SomeoneProfileHeaderProps = {
  onClickSee?: () => void,
  user: User;
  links: ProfileLink[];
}

export function SomeoneProfileHeader({onClickSee, user, links }: SomeoneProfileHeaderProps) {
  return (
    <div className={styles.container}>

      <div className={styles.mobileHeader}>
        <p className={styles.titleMobile}>
          Профиль студентика
        </p>

        <button className={styles.seeMobile} onClick={onClickSee}>
          <MoreLogo/>
        </button>
      </div>

      <div className={styles.header}>
        <div className={styles.bioBlock}>

          {/*Основа профиля*/}
          {
            user.profilePicture ?
              <img className={styles.avatar} src={user.profilePicture} alt="Аватар студента" /> :
              <div className={styles.avatar}>
                <UserIcon/>
              </div>
          }

          <div className={styles.roleLabel}>
            {'mentor'}
          </div>

          <div className={styles.statuses}>
            {getStatuses({ type: 'aha' })}
            {getStatuses({ type: 'toughGuy' })}
          </div>

          <div className={styles.infoBlock}>
            <div className={styles.nameBlock}>
              <p>
                {user.meta.lastName}
              </p>
              <p>
                {user.meta.firstName}
              </p>
            </div>
            <div className={styles.groupBlock}>
              {/*TODO МОК*/}
              <p>
                8К67
                {/*{user.group}*/}
              </p>
              <p>
                {/*{user.group} курс*/}
                8 курс
              </p>
            </div>
          </div>
        </div>

        {/*Блок ссылок*/}
        <div className={styles.linkBlock}>
          <div className={styles.headerLink}>
            <p>
              Контакты
            </p>
            <div className={styles.email}>
              <MailLogo className={styles.mailLogo}/>
              {user.email}
              <OpenLogo className={styles.whiteShareLogo}/>
            </div>
          </div>
          <div className={styles.linkList}>
            {
              links.map(link => (
                <div key={link.type} className={clsx(styles.linkBody, link.type === 'element' && styles.special)}>
                  <div className={styles.body}>
                    {getLogo(link.type)}
                    <p className={link.type === 'element' ? styles.tpu : ''}>
                      {
                        link.link
                      }
                    </p>
                  </div>
                  {
                    link.type === 'element' ? <CopyLogo className={styles.shareLogo}/> : <OpenLogo className={styles.shareLogo}/>
                  }
                </div>
              ))
            }
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <p>
          О себе
        </p>
        {
          user.meta.bio ?
            <p>
              {user.meta.bio}
            </p> :
            <p>
              Приветик! Я первый раз на этом сайтике и еще не успел заполнить свой профиль. Надеюсь ничего страшного 👉👈
            </p>
        }

      </div>
    </div>
  )
}

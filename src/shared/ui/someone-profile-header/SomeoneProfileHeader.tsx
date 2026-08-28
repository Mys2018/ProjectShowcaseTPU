import styles from './SomeoneProfileHeader.module.css'
import clsx from "clsx";
import type {User} from "@/entities/user";
// import {getStatuses} from "@/shared/ui/statuses/getStatuses.tsx";
import type {Messengers} from "@/entities/user/model/types.ts";
import UserIcon from '@/shared/ui/icons/fallback_personal.svg?react'
import TgLogo from '@/shared/ui/icons/telegram.svg?react'
import ElementLogo from '@/shared/ui/icons/white_element.svg?react'
import VkLogo from '@/shared/ui/icons/vk.svg?react'
import CopyLogo from '@/shared/ui/icons/copy.svg?react'
import OpenLogo from '@/shared/ui/icons/open.svg?react'
import MailLogo from '@/shared/ui/icons/email.svg?react'
import MoreLogo from '@/shared/ui/icons/more.svg?react'
import blankPictureSrc from '@/shared/assets/blank_photo.jpg'

type linkType = 'telegram' | 'tg' | 'vk' | 'element'

const getLogo = (type: linkType | undefined) => {
  switch (type) {
    case 'telegram':
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

/** Якорь для кнопки «Связаться» на мобильной панели. */
export const CONTACTS_ANCHOR_ID = 'profile-contacts'

type SomeoneProfileHeaderProps = {
  onClickSee?: () => void,
  user: User;
  links: Messengers;
  /** Короткая подсветка блока контактов после нажатия «Связаться». */
  highlight?: boolean;
}

export function SomeoneProfileHeader({onClickSee, user, links, highlight }: SomeoneProfileHeaderProps) {
  return (
    <div className={styles.container}>

      <img className={styles.backgroundPicture} src={blankPictureSrc} alt={'Фон карточки пользователя'}/>

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

          {/*<div className={styles.statuses}>*/}
          {/*  {getStatuses({ type: 'aha' })}*/}
          {/*  {getStatuses({ type: 'toughGuy' })}*/}
          {/*</div>*/}

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
            <div 
              className={styles.email} 
              onClick={() => window.location.href = `mailto:${user.email}`}
            >
              <MailLogo className={styles.mailLogo}/>
              {user.email}
              <OpenLogo className={styles.whiteShareLogo}/>
            </div>
          </div>
          <div id={CONTACTS_ANCHOR_ID} className={clsx(styles.linkList, highlight && styles.highlight)}>
            {
              links && ['element', 'telegram', 'vk'].map((type) => {
                const link = links[type as keyof Messengers];
                if (!link) return null;
                return (
                  <div 
                    key={type} 
                    className={clsx(styles.linkBody, type === 'element' && styles.special)}
                    onClick={() => {
                      if (type === 'element') {
                        navigator.clipboard.writeText(link);
                      } else {
                        const url = `https://${type === 'telegram' ? 't.me' : 'vk.ru'}/${link.slice(1, link.length)}`;
                        window.open(url, '_blank', 'noopener, noreferrer');
                      }
                    }}
                  >
                    <div className={styles.body}>
                      {getLogo(type as linkType)}
                      <p className={type === 'element' ? styles.tpu : ''}>
                        {link}
                      </p>
                    </div>
                    {
                      type === 'element' ? <CopyLogo className={styles.shareLogo}/> : <OpenLogo className={styles.shareLogo}/>
                    }
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <p className={styles.footerTitle}>О себе</p>
        {user.meta.bio ? (
          <p className={styles.footerText}>{user.meta.bio}</p>
        ) : (
          <p className={styles.footerText}>
            Приветик! Я первый раз на этом сайтике и еще не успел заполнить свой профиль. Надеюсь ничего страшного 👉👈
          </p>
        )}

        {user.meta.interests && (
          <>
            <p className={styles.footerTitle}>Мои интересы</p>
            <p className={styles.footerText}>{user.meta.interests}</p>
          </>
        )}
      </div>
    </div>
  )
}

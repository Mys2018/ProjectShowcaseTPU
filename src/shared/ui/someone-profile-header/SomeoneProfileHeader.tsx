import styles from './SomeoneProfileHeader.module.css'
import clsx from "clsx";
import {getAvatarRoleInfo, type User} from "@/entities/user";
// import {getStatuses} from "@/shared/ui/statuses/getStatuses.tsx";
import type {Messengers} from "@/entities/user/model/types.ts";
import TgLogo from '@/shared/ui/icons/telegram.svg?react'
import ElementLogo from '@/shared/ui/icons/white_element.svg?react'
import VkLogo from '@/shared/ui/icons/vk.svg?react'
import CopyLogo from '@/shared/ui/icons/copy.svg?react'
import OpenLogo from '@/shared/ui/icons/open.svg?react'
import MailLogo from '@/shared/ui/icons/email.svg?react'
// import MoreLogo from '@/shared/ui/icons/more.svg?react'
import {Avatar} from "@/entities/user/ui/avatar/Avatar.tsx";

import STUDENT_src from '@/shared/assets/svg/STUDENT.svg'

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
  user: User;
  links: Messengers;
  /** Короткая подсветка блока контактов после нажатия «Связаться». */
  highlight?: boolean;
}

export function SomeoneProfileHeader({user, links, highlight }: SomeoneProfileHeaderProps) {
  return (
    <div className={styles.container}>

      <img className={styles.backgroundPicture} src={STUDENT_src} alt={'Фон карточки пользователя'} loading="lazy" decoding="async" />

      <div className={styles.mobileHeader}>
        <p className={styles.titleMobile}>
          Профиль студентика
        </p>

        {/*<button className={styles.seeMobile} onClick={onClickSee}>*/}
        {/*  <MoreLogo/>*/}
        {/*</button>*/}
      </div>

      <div className={styles.header}>
        <div className={styles.bioBlock}>

          <Avatar
            fallbackType={getAvatarRoleInfo(user?.roles)?.fallback || 'user'}
            size={'108px'}
            labelColor={'white'}
            label={getAvatarRoleInfo(user?.roles)?.label}
            strokeColor={'grad'}
          />

          <div className={styles.infoBlock}>
            <div className={styles.nameBlock}>
              {user.meta.lastName && <p>{user.meta.lastName}</p>}
              <p>{[user.meta.firstName, user.meta.patronym].filter(Boolean).join(' ')}</p>
            </div>
            {(user.group || user.grade) && (
              <div className={styles.groupBlock}>
                {user.group && <p>{user.group}</p>}
                {user.grade && <p>{user.grade} курс</p>}
              </div>
            )}
          </div>
        </div>

        {/*Блок ссылок*/}
        {/* Якорь и подсветка — на всём блоке: заголовок, почта и мессенджеры
            должны отзываться на «Связаться» вместе, а не по отдельности. */}
        <div id={CONTACTS_ANCHOR_ID} className={clsx(styles.linkBlock, highlight && styles.highlight)}>
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
          <div className={styles.linkList}>
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

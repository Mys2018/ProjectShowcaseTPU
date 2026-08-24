import styles from './LinkBlock.module.css'
import TgLogo from '@/shared/ui/icons/telegram.svg?react'
import ElementLogo from '@/shared/assets/tpu_element.svg?react'
import VkLogo from '@/shared/ui/icons/vk.svg?react'
import Plus from '@/shared/ui/icons/plus.svg?react'
import EditIcon from '@/shared/ui/icons/edit.svg?react'
import clsx from "clsx";
import type {Messengers, MessengerType} from "@/entities/user/model/types.ts";
import {useModalStore} from "@/shared/model";
import {useUpdateProfileMeta} from "@/entities/user/api/queries.ts";

type LinkBlockProps = {
  linksObj: Messengers
};



const getLogo = (type: MessengerType, link?: string) => {
  switch (type) {
    case 'telegram':
      return <TgLogo className={`${styles.logo} ${link ? '' : styles.smallLogo}`}/>
    case 'vk':
      return <VkLogo className={`${styles.logo} ${link ? '' : styles.smallLogo}`}/>
    case 'element':
      return <ElementLogo className={`${styles.logo} ${link ? '' : styles.smallLogo}`}/>
    default:
      return
  }
}

const getLabel = (type: MessengerType) => {
  switch (type) {
    case 'telegram':
      return "Telegram"
    case 'vk':
      return "ВК"
    case 'element':
      return "ТПУ-Element"
    default:
      return ""
  }
}

export const LinkBlock = ({ linksObj }: LinkBlockProps) => {

  const { openModal, closeModal} = useModalStore();

  const { mutate: updateProfileMeta} = useUpdateProfileMeta();

  const links: Array<{ type: MessengerType; link?: string }> = [
    {
      type: 'element',
      link: linksObj.element
    },
    {
      type: 'telegram',
      link: linksObj.telegram
    },
    {
      type: 'vk',
      link: linksObj.vk
    }
  ]

  const handleOpenModal = (type: MessengerType, value: string | undefined) => {
    openModal('LINK_UPDATE', {
      firstValue: value,
      typeLink: getLabel(type),
      onSubmit: (newValue: string) => {
        updateProfileMeta({
          messengers: {
            ...linksObj,
            [type]: newValue
          }
        })
      },
      onDelete: () => {
        updateProfileMeta({
          messengers: {
            ...linksObj,
            [type]: null
          }
        })
      },
      onClose: closeModal
    })
  }

  return (
    <div className={styles.linkList}>
      {
        links.map((link, index) => (
          <div key={index} className={clsx(styles.container, (link.link ? styles.active : ''),  (link.type === 'element' && styles.special))}>
            {
              link.link && link.type !== 'element' ?
                <button className={styles.editButton} onClick={() => handleOpenModal(link.type, link.link)}>
                  <EditIcon className={styles.editIcon}/>
                </button> : ''
            }
            {
              link.link !== null ? (
                <div className={styles.innerContainerActive}>
                  {link.type && getLogo(link.type, link.link)}
                  <div className={styles.info}>
                    <h6 className={clsx(link.type === 'element' && styles.special)}>
                      {getLabel(link.type)}
                    </h6>
                    <p className={clsx(link.type === 'element' && styles.special)}>
                      {link.link}
                    </p>
                  </div>
                </div>
              ) : (
                <div className={styles.innerContainer}>
                  <div className={styles.header}>
                    {link.type ? getLogo(link.type, link.link) : ''}
                    <h6 className={clsx(link.type === 'element' && styles.special)}>
                      {getLabel(link.type)}
                    </h6>

                  </div>
                  {
                    link.type !== 'element' && <button onClick={() => handleOpenModal(link.type, link.link)}>
                      <Plus/>
                      Добавить
                    </button>
                  }

                </div>
              )
            }
          </div>
        ))
      }
    </div>
  );
};
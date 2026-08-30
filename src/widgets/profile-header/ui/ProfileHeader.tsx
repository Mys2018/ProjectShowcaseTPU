import type {Messengers, User} from '@/entities/user/model/types';
import EmailIcon from '@/shared/ui/icons/email.svg?react';
import EditIcon from '@/shared/ui/icons/edit.svg?react';
import BigInfoIcon from '@/shared/ui/icons/big_info.svg?react';
import { LinkBlock } from '@/shared/ui/link-block/LinkBlock';
import styles from './ProfileHeader.module.css';

import { useModalStore } from '@/shared/model';
import { getAvatarRoleInfo } from '@/shared/lib';
import {Avatar} from "@/shared/ui/avatar/Avatar.tsx";

interface ProfileHeaderProps {
  data: User;
  links: Messengers;
}

export const ProfileHeader = ({ data, links }: ProfileHeaderProps) => {
  const openModal = useModalStore((state) => state.openModal);
  const roleInfo = getAvatarRoleInfo(data.roles);

  return (
    <div className={styles.mainInfo}>
      <div className={styles.infoGrid}>
        <section className={styles.mainInfoContainer}>
          {/*<div className={styles.avatarContainer}>*/}
          {/*  {*/}
          {/*    data.profilePicture ?*/}
          {/*      <img className={styles.avatar} src={data.profilePicture} alt="Аватар студента" /> :*/}
          {/*      <div className={styles.avatar}>*/}
          {/*        <UserIcon className={styles.userIcon}/>*/}
          {/*      </div>*/}
          {/*  }*/}
          {/*  <button className={styles.editButton} onClick={() => openModal('AVATAR_UPLOAD')}>*/}
          {/*    <EditIcon />*/}
          {/*  </button>*/}
          {/*  <div className={styles.status}>*/}
          {/*    mentor*/}
          {/*  </div>*/}
          {/*</div>*/}
          <Avatar 
            fallbackType={roleInfo?.fallback || 'user'} 
            size={"70px"} 
            strokeColor={"grey"} 
            onClickEditButton={() => openModal('AVATAR_UPLOAD')} 
            label={roleInfo?.label} 
            labelColor={roleInfo?.label ? 'white' : undefined}
            picture={data.profilePicture}
          />
          <div className={styles.nameContainer}>
            <div className={styles.name}>
              <p>{data.meta.firstName}</p>
              <p>{data.meta.lastName}</p>
            </div>
            <p className={styles.group}>
              {/*{data.group}, {data.grade} курс*/}
              8К67, 3 курс
            </p>
            {/*// TODO*/}
            {/*{data.group && data.grade && (*/}
            {/*  <p className={styles.group}>*/}
            {/*    /!*{data.group}, {data.grade} курс*!/*/}
            {/*    8К33, 3 курс*/}
            {/*  </p>*/}
            {/*)}*/}
          </div>
        </section>

        <section className={styles.editBody}>
          <BigInfoIcon className={styles.bigInfoIcon} />
          <p>
            Данные, которые не имеют при себе значка редактирования (<EditIcon/>), заполняются автоматически и недоступны для ручного изменения. Если вы нашли в них ошибку, пожалуйста, свяжитесь со своим куратором.
          </p>
          {/*<p className={styles.appearance}>*/}
          {/*  Внешний вид профиля*/}
          {/*</p>*/}
          {/*<button className={styles.outEditButton}>*/}
          {/*  Настроить*/}
          {/*</button>*/}
        </section>

        <section className={styles.secondInfoContainer}>
          <div className={styles.header}>
            <div className={styles.contactsText}>
              <h1>Контакты</h1>
              <p>для командного взаимодействия.</p>
            </div>

            <div className={styles.emailContainer}>
              <EmailIcon />
              <p>{data.email}</p>
            </div>
          </div>

          <LinkBlock
            linksObj={links}
          />
        </section>
      </div>
      {/*<div className={styles.infoLabel}>*/}
      {/*  <BigInfoIcon className={styles.bigInfoIcon} />*/}
      {/*  <p>*/}
      {/*    Данные, которые не имеют при себе значка редактирования, заполняются автоматически и недоступны для ручного изменения. Если вы нашли в них ошибку, пожалуйста, свяжитесь со своим куратором.*/}
      {/*  </p>*/}
      {/*</div>*/}
    </div>
  );
};
import styles from './SomeoneProfile.module.css'
import { MyCompetenciesList } from "@/features/my-competencies";
import { useNavigate, useParams } from "react-router-dom";
import { useUserById } from "@/entities/user";
import BackIcon from '@/shared/ui/icons/back.svg?react';
import FlagIcon from '@/shared/ui/icons/flag.svg?react';
import { SomeoneProfileHeader } from "@/shared/ui/someone-profile-header/SomeoneProfileHeader.tsx";
import MoreIcon from '@/shared/ui/icons/more.svg?react'
import { Portfolio } from "@/features/portfolio/Portfolio.tsx";
import { PopupMenu } from "@/shared/ui/popup-menu/PopupMenu.tsx";
import { usePageTitle, usePreviousPageTitle } from "@/shared/model";


export function SomeoneProfile() {
  usePageTitle('профилю пользователя');
  const backTitle = usePreviousPageTitle('Назад к списку проектов');

  const navigate = useNavigate();
  const params = useParams<{ id: string }>()
  const uid = Number(params.id)
  const { data: user } = useUserById(uid)

  if (!user) {
    return null;
  }

  return (
    <div className={styles.mainContent}>
      <section className={styles.headerLeft} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>
        <BackIcon className={styles.backIcon} />
        <p className={styles.back}>{backTitle}</p>
      </section>

      <section className={styles.title}>
        Профиль студентика
      </section>

      <section className={styles.see}>
        <PopupMenu
          trigger={<button
            type="button"
            className={styles.moreMenuButton}
          >
            <MoreIcon />
          </button>}
        >
          <PopupMenu.Row onClick={() => { }} title={'Сообщить о нарушении'}>
            <FlagIcon />
          </PopupMenu.Row>
        </PopupMenu>
      </section>

      <section className={styles.profile}>
        <SomeoneProfileHeader user={user} links={user.meta.messengers} onClickSee={() => navigate(`/profile/${user.id}`)} />
        <div className={styles.body}>
          {user.meta.skills && <MyCompetenciesList savedSkills={user.meta.skills} readonly={true} />}
          <Portfolio firstValue={user.meta.portfolioLink || ''} readonly={true} />

        </div>
      </section>
    </div>
  );
}

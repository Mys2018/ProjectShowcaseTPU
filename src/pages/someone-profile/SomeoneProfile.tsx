import styles from './SomeoneProfile.module.css'
import {MyCompetenciesList} from "@/features/my-competencies";
import {useNavigate, useParams} from "react-router-dom";
import {useUserById} from "@/entities/user";
import BackIcon from '@/shared/ui/icons/back.svg?react';
import {SomeoneProfileHeader} from "@/shared/ui/someone-profile-header/SomeoneProfileHeader.tsx";
import MoreLogo from '@/shared/ui/icons/more.svg?react'
import {Portfolio} from "@/features/portfolio/Portfolio.tsx";


export function SomeoneProfile() {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>()
  const uid = params.id  || ''
  const { data: user } = useUserById(uid)

  if (!user) {
    return null;
  }

  return (
    <div className={styles.mainContent}>
      <section className={styles.headerLeft} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>
        <BackIcon className={styles.backIcon}/>
        <p className={styles.back}>Назад к списку проектов</p>
      </section>

      <section className={styles.title}>
        Профиль студентика
      </section>

      <section className={styles.see} onClick={() => navigate(`/profile/${user.id}`)}>
        <MoreLogo/>
      </section>

      <section className={styles.profile}>
        <SomeoneProfileHeader user={user} links={user.meta.messengers} onClickSee={() => navigate(`/profile/${user.id}`)}/>
        <div className={styles.body}>
          { user.meta.skills && <MyCompetenciesList savedSkills={user.meta.skills} readonly={true}/> }
          { user.meta.portfolioLink && <Portfolio firstValue={user.meta.portfolioLink} readonly={true}/> }

        </div>
      </section>
    </div>
  );
}

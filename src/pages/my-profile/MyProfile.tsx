import { useNavigate, useBlocker } from 'react-router-dom';
import styles from './MyProfile.module.css';
import { useMe } from '@/entities/user/api/queries';
import { ProfileHeader } from '@/widgets/profile-header';
import { AboutMe } from "@/features/about-me/ui/AboutMe.tsx";
import { MyInterests } from "@/features/my-interests";
import { MyCompetenciesList } from "@/features/my-competencies";
import BackIcon from '@/shared/ui/icons/back.svg?react';
import EyeIcon from '@/shared/ui/icons/eye.svg?react';
import { Portfolio } from "@/features/portfolio/Portfolio.tsx";
import { useProfileEditStore, useModalStore } from '@/shared/model';
import { useSkillsStore } from '@/features/my-competencies/model/store/useSkillsStore.ts';
import { useEffect } from 'react';

export const MyProfile = () => {
  const navigate = useNavigate();
  const { data: user } = useMe();
  const { activeEditBlock, hasUnsavedChanges, setActiveEditBlock, setHasUnsavedChanges } = useProfileEditStore();
  const { openModal, closeModal } = useModalStore();

  useEffect(() => {
    return () => {
      setActiveEditBlock(null);
      setHasUnsavedChanges(false);
      useSkillsStore.getState().cancelEditing();
    };
  }, [setActiveEditBlock, setHasUnsavedChanges]);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasUnsavedChanges && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state === 'blocked') {
      openModal('CONFIRM_CANCEL', {
        title: 'У вас есть несохраненные изменения',
        description: 'Если вы покинете страницу, они будут безвозвратно потеряны. Вы уверены, что хотите уйти?',
        cancelText: 'Покинуть страницу',
        confirmText: 'Вернуться к редактированию',
        onDecline: () => {
          closeModal();
          useSkillsStore.getState().cancelEditing();
          blocker.proceed?.();
          setActiveEditBlock(null);
          setHasUnsavedChanges(false);
        },
        onConfirm: () => {
          closeModal();
          blocker.reset?.();
        }
      });
    }
  }, [blocker, openModal, closeModal, setActiveEditBlock, setHasUnsavedChanges]);

  if (!user || user.id === 'loading...') {
    return null;
  }

  return (
    <div className={styles.mainContent}>
      <section className={styles.headerLeft} onClick={() => navigate(-1)}>
        <BackIcon className={styles.backIcon}/>
        <p className={styles.back}>Назад к списку проектов</p>
      </section>

      <section className={styles.title}>
        <h2>Мой профиль</h2>
      </section>

      <section className={styles.see} onClick={() => navigate(`/profile/${user.id}`)}>
        <EyeIcon/>
        <p>
          Посмотреть опубликованный вид
        </p>
      </section>

      <section className={styles.profile}>
        <div style={{ opacity: activeEditBlock ? 0.5 : 1, pointerEvents: activeEditBlock ? 'none' : 'auto', transition: 'opacity 0.2s' }}>
          <ProfileHeader data={user} links={user.meta.messengers} />
        </div>
        <div className={styles.body}>
          <div style={{ opacity: (activeEditBlock && activeEditBlock !== 'aboutMe') ? 0.5 : 1, pointerEvents: (activeEditBlock && activeEditBlock !== 'aboutMe') ? 'none' : 'auto', transition: 'opacity 0.2s', flex: 1 }}>
            <AboutMe
              MAX_LENGTH={500}
              MIN_LENGTH={100}
              bio={user.meta.bio}
              className={styles.wid}
            />
          </div>
          <div style={{ opacity: (activeEditBlock && activeEditBlock !== 'interests') ? 0.5 : 1, pointerEvents: (activeEditBlock && activeEditBlock !== 'interests') ? 'none' : 'auto', transition: 'opacity 0.2s', flex: 1 }}>
            <MyInterests
              MAX_LENGTH={500}
              MIN_LENGTH={100}
              interests={user.meta.interests}
              className={styles.wid}
            />
          </div>
          <div style={{ opacity: (activeEditBlock && activeEditBlock !== 'competencies') ? 0.5 : 1, pointerEvents: (activeEditBlock && activeEditBlock !== 'competencies') ? 'none' : 'auto', transition: 'opacity 0.2s', flex: 1 }}>
            <MyCompetenciesList savedSkills={user.meta.skills} />
          </div>
          <div style={{ opacity: activeEditBlock ? 0.5 : 1, pointerEvents: activeEditBlock ? 'none' : 'auto', transition: 'opacity 0.2s', flex: 1 }}>
            <Portfolio firstValue={user.meta.portfolioLink} />
          </div>
        </div>
      </section>
    </div>
  );
};
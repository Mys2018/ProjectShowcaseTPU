import {useState, useMemo} from "react";
import {useNavigate} from "react-router-dom";
import styles from './MobileLayoutProjectPage.module.css'
import {MyApplicationsSheet, ProjectActionPanel, isActiveApplication, myApplicationsParams} from "@/widgets/project-action-panel";
import {FreeCompetencies} from "@/widgets/free-competencies/FreeCompetencies.tsx";
import {Drawer} from "@/features/drawer/Drawer.tsx";
import {useApplications} from "@/entities/application";
import {type ProjectCardData, typeProjectsLabel} from "@/entities/project";
import { usePlatforms } from "@/entities/platforms/api/queries.ts";
import {useUserById} from "@/entities/user";
import {useIsProfileFilled} from "@/entities/user/lib";
import {ProjectStatusLabel} from "@/shared/constants/project-status-label/ProjectStatusLabel.tsx";
import {FloatingPanel} from "@/shared/ui/floating-panel";
import {ProjectInfo} from "@/shared/ui/project-info/ProjectInfo.tsx";
import {SegmentedSwitch} from "@/shared/ui/segmented-tabs/SegmentedSwitch.tsx";
import {ProfileWidget} from "@/shared/ui/small-widgets/profile-widget/ProfileWidget.tsx";
import {ProjectTeam} from "@/shared/ui/small-widgets/project-team/ProjectTeam.tsx";
import {KeyPoints} from "@/shared/ui/small-widgets/key-points/KeyPoints.tsx";
import {LinkContainer} from "@/shared/ui/small-widgets/link-block/LinkContainer.tsx";
import {ProjectPrd} from "@/shared/ui/project-prd/ProjectPrd.tsx";
import {PopupMenu} from "@/shared/ui/popup-menu/PopupMenu.tsx";
import {ROUTES} from "@/shared";
import IdIcon from '@/shared/ui/icons/id.svg?react';
import ShareIcon from '@/shared/ui/icons/share.svg?react';
import MoreIcon from '@/shared/ui/icons/more.svg?react'
import UpIcon from '@/shared/ui/icons/up.svg?react';

interface ProjectPageProps {
  project: ProjectCardData
}


export const MobileLayoutProjectPage = ({ project }: ProjectPageProps) => {

  // TODO
  const { data: owner } = useUserById(project.ownerId)
  const [activeTab, setActiveTab] = useState<'about' | 'team'>('about');

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [blockedBy, setBlockedBy] = useState<'guest' | 'profile' | null>(null);
  const [isApplicationsOpen, setApplicationsOpen] = useState(false);
  const navigate = useNavigate();
  const { isProfileFilled } = useIsProfileFilled();
  const { data: applications } = useApplications(myApplicationsParams(project.id));
  const myApplications = (applications?.applications ?? []).filter(isActiveApplication);

  const options = [
    { value: 'about', label: 'О проекте' },
    { value: 'team', label: 'Трек и команда' }
  ] as const;

  const teamMock = [
    { name: 'Фадеев', role: 'Backend', avatarSrc: '' },
    { name: 'Яра', role: 'Frontend', avatarSrc: '' }
  ];

  const { data: platformsData } = usePlatforms();

  const links = useMemo(() => {
    const result: { title: string; link: string; service: string }[] = [];
    if (!platformsData) return result;

    const findPlatformName = (id: string) => {
      for (const group of platformsData) {
        const found = group.platforms.find(p => p.platformId === id);
        if (found) return found.name;
      }
      return 'Unknown';
    };

    if (project.repository) {
      project.repository.forEach(item => {
        result.push({ title: 'Репозиторий', service: findPlatformName(item.platformId), link: item.url });
      });
    }

    if (project.taskTracker) {
      project.taskTracker.forEach(item => {
        result.push({ title: 'Таск-трекер', service: findPlatformName(item.platformId), link: item.url });
      });
    }

    if (project.designEnvironment) {
      project.designEnvironment.forEach(item => {
        result.push({ title: 'Дизайн-среда', service: findPlatformName(item.platformId), link: item.url });
      });
    }

    return result;
  }, [project, platformsData]);

  const checkpointsMock = [
    { title: 'Старт работ', deadline: '25-05-2026', status: true },
    { title: 'Постерная сессия', deadline: '29-05-2026', status: false }
  ];

  if (!owner) {
    return null
  }

  return (
    <main className={styles.main} >

      <span className={styles.topElement} id={'top'}></span>

      <section className={styles.topBlock} >
        <div className={styles.leftTopBlock}>
          {typeProjectsLabel(project.type)}
          <ProjectStatusLabel status={project.status} />
        </div>

        <div className={styles.rightTopBlock}>
          <ShareIcon />
          <PopupMenu
            trigger={<button
              type="button"
              className={styles.moreMenuButton}
            >
              <MoreIcon />
            </button>}
          >
            <PopupMenu.Row onClick={() => { }} title={'Скопировать ID'}>
              <IdIcon />
            </PopupMenu.Row>
          </PopupMenu>
        </div>
      </section>

      <h1 className={styles.title}>
        {project.meta.title}
      </h1>

      <ProjectInfo data={project} />

      <section className={styles.mainBlock}>
        <SegmentedSwitch
          options={options}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
        <div className={styles.widgetList}>
          {
            activeTab === 'about' ? (
              <div className={styles.prdBlock}>
                <ProjectPrd PRD={project.prdMeta} />
              </div>
            ) : (
              <>
                <ProfileWidget
                  last_name={owner.meta.lastName}
                  first_name={owner.meta.firstName}
                  role="Менеджер данного проекта"
                  avatarSrc=""
                />
                <ProjectTeam
                  list={teamMock}
                  openFreeCompetency={() => setDrawerOpen(true)}
                />
                <KeyPoints
                  checkpoints={checkpointsMock}
                />
                {links.length > 0 && <LinkContainer links={links} />}
              </>
            )
          }
        </div>
      </section>

      <a className={styles.upButton} href="#top">
        <UpIcon />
        Наверх
      </a>

      <ProjectActionPanel
        project={project}
        isProfileFilled={isProfileFilled}
        onOpenCompetencies={() => setDrawerOpen(true)}
        onOpenApplications={() => setApplicationsOpen(true)}
        onBlocked={setBlockedBy}
        // TODO: экрана баллов и формы отзыва ещё нет — бэк не готов
        onShowPoints={() => {}}
        onLeaveReview={() => {}}
        onShare={() => {}}
      />

      {blockedBy && (
        <FloatingPanel.Hint
          title={blockedBy === 'profile' ? 'Заполните профиль для отклика на проект' : undefined}
          text={
            blockedBy === 'profile'
              ? 'Для подачи заявки необходимо заполнить блок «О себе» и указать свои навыки. Это поможет наставнику оценить вашу кандидатуру.'
              : 'Откликаться на проекты могут только зарегистрированные пользователи.'
          }
          actionText={blockedBy === 'profile' ? 'Перейти к заполнению' : 'Войти в аккаунт'}
          onAction={() => void navigate(blockedBy === 'profile' ? ROUTES.PROFILE.BASE : ROUTES.LOGIN)}
          onClose={() => setBlockedBy(null)}
        />
      )}

      <Drawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        <FreeCompetencies roles={project.roles} />
      </Drawer>

      <Drawer isOpen={isApplicationsOpen} onClose={() => setApplicationsOpen(false)}>
        <MyApplicationsSheet project={project} applications={myApplications} />
      </Drawer>
    </main>
  )
}
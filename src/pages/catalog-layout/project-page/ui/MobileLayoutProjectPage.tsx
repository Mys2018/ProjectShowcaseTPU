import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from './MobileLayoutProjectPage.module.css'
import { MyApplicationsSheet, ProjectActionPanel, isActiveApplication, myApplicationsParams } from "@/widgets/project-action-panel";
import { FreeCompetencies } from "@/widgets/free-competencies/FreeCompetencies.tsx";
import { Drawer } from "@/features/drawer/Drawer.tsx";
import { useApplications } from "@/entities/application";
import { type ProjectCardData, typeProjectsLabel, useProjectTeam } from "@/entities/project";
import { usePlatformFinder } from "@/entities/platforms";
import { useIsProfileFilled } from "@/entities/user";
import { useUserById } from "@/entities/user";
import { ProjectPublicStatusLabel } from "@/entities/project/ui/project-status-label/ProjectPublicStatusLabel.tsx";
import { FloatingPanel } from "@/shared/ui/floating-panel";
import { ProjectInfo } from "@/shared/ui/project-info/ProjectInfo.tsx";
import { SegmentedSwitch } from "@/shared/ui/segmented-tabs/SegmentedSwitch.tsx";
import { ProfileWidget } from "@/shared/ui/small-widgets/profile-widget/ProfileWidget.tsx";
import { ProjectTeam } from "@/shared/ui/small-widgets/project-team/ProjectTeam.tsx";
import { KeyPoints } from "@/shared/ui/small-widgets/key-points/KeyPoints.tsx";
import { LinkContainer } from "@/shared/ui/small-widgets/link-block/LinkContainer.tsx";
import { ProjectPrd } from "@/shared/ui/project-prd/ProjectPrd.tsx";
import { PopupMenu } from "@/shared/ui/popup-menu/PopupMenu.tsx";
import { ROUTES } from "@/shared";
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
  const { data: teamMembers = [], isLoading: isTeamLoading } = useProjectTeam(project.id)
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

  const teamList = useMemo(() => {
    return (teamMembers ?? []).map((member) => {
      const fullName = `${member.meta?.firstName ?? ''} ${member.meta?.lastName ?? ''}`.trim();
      return {
        id: member.userId,
        name: fullName || member.email || `Участник #${member.userId}`,
        role: member.roles && member.roles.length > 0 ? member.roles.join(', ') : 'Участник',
        avatarSrc: member.profilePicture,
      };
    });
  }, [teamMembers]);

  const { platformsData, findPlatformName } = usePlatformFinder();

  const links = useMemo(() => {
    const result: { title: string; link: string; service: string }[] = [];

    const getServiceName = (item: { platformId: string; name?: string }) => {
      const found = findPlatformName(item.platformId);
      if (found && found !== 'Unknown') return found;
      return item.name || 'Платформа';
    };

    if (project.repository) {
      project.repository.forEach(item => {
        result.push({ title: 'Репозиторий', service: getServiceName(item), link: item.url });
      });
    }

    if (project.taskTracker) {
      project.taskTracker.forEach(item => {
        result.push({ title: 'Таск-трекер', service: getServiceName(item), link: item.url });
      });
    }

    const otherLinks = project.otherPlatforms || project.designEnvironment;
    if (otherLinks) {
      otherLinks.forEach(item => {
        result.push({ title: 'Прочее', service: getServiceName(item), link: item.url });
      });
    }

    return result;
  }, [project, platformsData, findPlatformName]);

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
          <ProjectPublicStatusLabel status={project.status} />
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
                  last_name={owner?.meta?.lastName ?? ''}
                  first_name={owner?.meta?.firstName ?? ''}
                  role="Менеджер данного проекта"
                  avatarSrc=""
                />
                <ProjectTeam
                  list={teamList}
                  isLoading={isTeamLoading}
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
        onShowPoints={() => { }}
        onLeaveReview={() => { }}
        onShare={() => { }}
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
import styles from './MobileLayoutProjectPage.module.css'
import {type ProjectCardData, typeProjectsLabel} from "@/entities/project";
import {ProjectStatusLabel} from "@/shared/ui/project-status-label/ProjectStatusLabel.tsx";

import IdIcon from '@/shared/ui/icons/id.svg?react';
import ShareIcon from '@/shared/ui/icons/share.svg?react';
import UpIcon from '@/shared/ui/icons/up.svg?react';

import {ProjectInfo} from "@/shared/ui/project-info/ProjectInfo.tsx";
import {SegmentedSwitch} from "@/shared/ui/segmented-tabs/SegmentedSwitch.tsx";
import {useState} from "react";
import {ProfileWidget} from "@/shared/ui/small-widgets/profile-widget/ProfileWidget.tsx";
// TODO
import {useUserById} from "@/entities/user";
import {ProjectTeam} from "@/shared/ui/small-widgets/project-team/ProjectTeam.tsx";
import {KeyPoints} from "@/shared/ui/small-widgets/key-points/KeyPoints.tsx";
import {LinkContainer} from "@/shared/ui/small-widgets/link-block/LinkContainer.tsx";
import {ProjectPrd} from "@/shared/ui/project-prd/ProjectPrd.tsx";
import {Drawer} from "@/features/drawer/Drawer.tsx";
import {FreeCompetencies} from "@/shared/ui/small-widgets/free-competencies/FreeCompetencies.tsx";

interface ProjectPageProps {
  project: ProjectCardData
}


export const MobileLayoutProjectPage = ({project} : ProjectPageProps ) => {

  // TODO
  const { data: owner } = useUserById(
    project?.ownerId?.toString() || ''
  )
  const [activeTab, setActiveTab] = useState<'about' | 'team'>('about');

  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const options = [
    { value: 'about', label: 'О проекте' },
    { value: 'team', label: 'Трек и команда' }
  ] as const;

  const teamMock = [
    { name: 'Фадеев', role: 'Backend', avatarSrc: '' },
    { name: 'Яра', role: 'Frontend', avatarSrc: '' }
  ];

  const linksMock = [
    { title: 'Репозиторий', service: 'GitHub', link: 'https://github.com' }
  ];


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
          <IdIcon />
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
                <LinkContainer links={linksMock} />
              </>
            )
          }
        </div>
      </section>

      <a className={styles.upButton} href="#top">
        <UpIcon />
        Наверх
      </a>

      <button className={styles.choiceComp} onClick={() => setDrawerOpen(true)}>
        Выбрать компетенцию
      </button>

      <Drawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        <FreeCompetencies roles={project.roles}/>
      </Drawer>
    </main>
  )
}
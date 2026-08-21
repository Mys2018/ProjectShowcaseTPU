import styles from "./DesktopLayoutProjectPage.module.css";
import { ProfileWidget } from "@/shared/ui/small-widgets/profile-widget/ProfileWidget.tsx";
import { KeyPoints } from "@/shared/ui/small-widgets/key-points/KeyPoints.tsx";
import { LinkContainer } from "@/shared/ui/small-widgets/link-block/LinkContainer.tsx";
import clsx from "clsx";
import { ProjectInfo } from "@/shared/ui/project-info/ProjectInfo.tsx";
import { ProjectPrd } from "@/shared/ui/project-prd/ProjectPrd.tsx";
import { FreeCompetencies } from "@/shared/ui/small-widgets/free-competencies/FreeCompetencies.tsx";
import { ProjectTeam } from "@/shared/ui/small-widgets/project-team/ProjectTeam.tsx";
import ShareIcon from '@/shared/ui/icons/share.svg?react';
import IdIcon from '@/shared/ui/icons/id.svg?react';
import BackIcon from '@/shared/ui/icons/back.svg?react';
import MoreIcon from '@/shared/ui/icons/more.svg?react'
import { useEffect, useRef, useState } from "react";
import type { ProjectCardData } from "@/entities/project";
// TODO
import { useUserById } from "@/entities/user";
import { useNavigate } from "react-router-dom";
import { ProjectStatusLabel } from "@/shared/constants/project-status-label/ProjectStatusLabel.tsx";
import { PopupMenu } from "@/shared/ui/popup-menu/PopupMenu.tsx";

interface ProjectPageProps {
  project: ProjectCardData
}

export const DesktopLayoutProjectPage = ({ project }: ProjectPageProps) => {

  const navigate = useNavigate();

  // TODO
  const { data: owner } = useUserById(
    project?.ownerId?.toString() || ''
  )

  const leftWidgetsRef = useRef<HTMLDivElement>(null);
  const projectsInfoRef = useRef<HTMLElement>(null);
  const rightWidgetsRef = useRef<HTMLDivElement>(null);

  const titleLabelRef = useRef<HTMLElement>(null)
  const titleTextRef = useRef<HTMLSpanElement>(null)

  const [isScrolling, setIsScrolling] = useState(true);

  useEffect(() => {
    const label = titleLabelRef.current
    const text = titleTextRef.current

    if (!label || !text) return;

    const checkOverflow = () => {
      const availableWidth = label.clientWidth - 32;
      const hasOverflow = text.offsetWidth > availableWidth;
      setIsScrolling(hasOverflow);
    }

    checkOverflow()

    const resizeObserver = new ResizeObserver(() => checkOverflow())
    resizeObserver.observe(label)

    return resizeObserver.disconnect()
  }, [project]);

  const teamMock = [
    { name: 'Фадеев', role: 'Backend', avatarSrc: '' },
    { name: 'Яра', role: 'Frontend', avatarSrc: '' }
  ];

  const linksMock = [
    { title: 'Репозиторий', service: 'GitHub', link: 'https://github.com' }
  ];


  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const target = e.currentTarget;
    const scrollTop = target.scrollTop;

    if (leftWidgetsRef.current && target !== leftWidgetsRef.current) {
      leftWidgetsRef.current.scrollTop = scrollTop;
    }
    if (projectsInfoRef.current && target !== projectsInfoRef.current) {
      projectsInfoRef.current.scrollTop = scrollTop;
    }
    if (rightWidgetsRef.current && target !== rightWidgetsRef.current) {
      rightWidgetsRef.current.scrollTop = scrollTop;
    }
  };

  // TODO
  if (!owner) {
    return null;
  }

  console.log(project)

  return (
    <main className={styles.main}>
      <div className={styles.headerLeft} onClick={() => navigate(-1)}>
        <BackIcon className={styles.backIcon} />
        <p className={styles.back}>Назад</p>
      </div>

      <aside className={styles.leftWidgets} ref={leftWidgetsRef} onScroll={handleScroll}>

        <ProfileWidget
          last_name={owner.meta.lastName}
          first_name={owner.meta.firstName}
          role="Менеджер данного проекта"
          avatarSrc=""
        />

        <KeyPoints
          checkpoints={project.checkpoints}
        />

        <LinkContainer links={linksMock} />

      </aside>

      <section className={clsx(styles.title)} ref={titleLabelRef}>
        <div
          className={isScrolling ? styles.marqueeContent : styles.marqueeContentStatic}
        >
          <span
            className={styles.titleText}
            ref={titleTextRef}
          >
            {project.meta.title}
          </span>

          {isScrolling && (
            <>
              <span className={styles.dot}>  </span>
              <span className={styles.titleText}>
                {project.meta.title}
              </span>
              <span className={styles.dot}>  </span>
            </>
          )}
        </div>
      </section>

      <section className={styles.projectsInfo} ref={projectsInfoRef} onScroll={handleScroll}>

        <ProjectInfo data={project} />

        <div className={styles.projectPrdBlock}>
          <ProjectPrd PRD={project.prdMeta} />
        </div>

      </section>

      <aside className={styles.idBlock}>

        <a className={styles.share} href='#'>
          <ShareIcon />
          Поделиться проектом
        </a>

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
      </aside>

      <aside className={styles.rightWidgets} ref={rightWidgetsRef} onScroll={handleScroll}>

        <div className={styles.projectStatus}>
          <span className={styles.statusLabel}>Статус:</span>
          <ProjectStatusLabel status={project.status} />
        </div>

        <FreeCompetencies roles={project.roles} />

        <ProjectTeam list={teamMock} />

      </aside>
    </main>
  )
}
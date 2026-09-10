import { useRef } from 'react';
import { useMediaQuery } from "usehooks-ts";
import { useLocation } from "react-router-dom";
import styles from './Catalog.module.css'
import { ProjectsHeader } from "@/widgets/ProjectsHeader";
import { MobileSearchBar } from "@/widgets/mobile-search-bar";
import { ProjectsGrid } from '@/widgets/projects-grid';
import { Filter } from "@/features/filter";
import { SearchField } from "@/shared/ui";
import { MOBILE_BREAKPOINT } from "@/shared/lib";
import { ROUTES } from '@/shared';

export const Catalog = () => {
  const location = useLocation();

  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
  const filterRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

  const programmaticScrolls = useRef(new WeakSet<HTMLElement>());

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const target = e.currentTarget;
    
    if (programmaticScrolls.current.has(target)) {
      programmaticScrolls.current.delete(target);
      return;
    }

    const scrollTop = target.scrollTop;

    if (filterRef.current && target !== filterRef.current) {
      if (filterRef.current.scrollTop !== scrollTop) {
        programmaticScrolls.current.add(filterRef.current);
        filterRef.current.scrollTop = scrollTop;
      }
    }

    if (projectsRef.current && target !== projectsRef.current) {
      if (projectsRef.current.scrollTop !== scrollTop) {
        programmaticScrolls.current.add(projectsRef.current);
        projectsRef.current.scrollTop = scrollTop;
      }
    }
  };

  const renderProjectGrid = () => {
    switch (location.pathname) {
      case ROUTES.PROJECTS.RECRUITMENT: {
        return <ProjectsGrid type='recruiting' />
      }
      case ROUTES.PROJECTS.IN_PROGRESS: {
        return <ProjectsGrid type='in-progress' />
      }
      default:
        return undefined
    }
  }

  return (
    <main className={styles.mainContent}>
      {isMobile ? (
        <MobileSearchBar />
      ) : (
        <aside className={styles.searchPart}>
          <SearchField />
        </aside>
      )}
      <aside className={styles.filterPart} ref={filterRef} onScroll={handleScroll}>
        <Filter />
      </aside>
      <section className={styles.projectHeader}>
        <ProjectsHeader />
      </section>
      <section className={styles.projectsPart} ref={projectsRef} onScroll={handleScroll}>
        {renderProjectGrid()}
      </section>
    </main>
  );
};
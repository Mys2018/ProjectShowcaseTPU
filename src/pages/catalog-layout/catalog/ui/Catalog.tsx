import { useRef } from 'react';
import { Outlet } from "react-router-dom";
import { useMediaQuery } from "usehooks-ts";
import styles from './Catalog.module.css'
import { ProjectsHeader } from "@/widgets/ProjectsHeader";
import { MobileSearchBar } from "@/widgets/mobile-search-bar";
import { Filter } from "@/features/filter";
import { SearchField } from "@/shared/ui";
import { usePageTitle } from "@/shared/model";
import { MOBILE_BREAKPOINT } from "@/shared/lib";

export const Catalog = () => {
  usePageTitle('каталогу');
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
  const filterRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const target = e.currentTarget;
    const scrollTop = target.scrollTop;

    if (filterRef.current && target !== filterRef.current) {
      filterRef.current.scrollTop = scrollTop;
    }

    if (projectsRef.current && target !== projectsRef.current) {
      projectsRef.current.scrollTop = scrollTop;
    }
  };

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
        <Outlet />
      </section>
    </main>
  );
};
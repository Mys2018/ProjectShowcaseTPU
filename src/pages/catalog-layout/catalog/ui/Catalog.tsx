import { useRef } from 'react';
import styles from './Catalog.module.css'
import { SearchField } from "@/shared/ui";
import { Filter } from "@/features/filter";
import { ProjectsHeader } from "@/widgets/ProjectsHeader";
import { Outlet } from "react-router-dom";
import { usePageTitle } from "@/shared/model";

export const Catalog = () => {
  usePageTitle('каталогу');
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
      <aside className={styles.searchPart}>
        <SearchField />
      </aside>
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
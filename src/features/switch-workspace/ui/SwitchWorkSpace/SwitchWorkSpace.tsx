import { useState, useRef, useEffect } from 'react';
import styles from './SwitchWorkSpace.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/shared';
import {useAuthStore} from "@/entities/user";
import type {AuthStatus} from "@/entities/user/model/store/useAuthStore.ts";

export default function SwitchWorkSpace() {
  type Tab = 'projects' | 'mySpace' | null;
  const [active, setActive] = useState<Tab>(null);
  const [selectorStyle, setSelectorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const navigate = useNavigate();
  const location = useLocation();
  const status = useAuthStore(state => state.status)

  const refs = {
    projects: useRef<HTMLDivElement>(null),
    mySpace: useRef<HTMLDivElement>(null),
  };

  const path = location.pathname;

  useEffect(() => {
    let currentActive: Tab = null;
    
    if (path.startsWith(ROUTES.PROFILE.BASE)) {
      currentActive = null;
    } else if (path.startsWith(ROUTES.PROJECTS.BASE) && !path.startsWith(ROUTES.PROJECTS.CREATE)) {
      currentActive = 'projects';
    } else if (
      path === ROUTES.MAIN || 
      path.startsWith(ROUTES.ACTIVITY.BASE) ||
      path.startsWith(ROUTES.MANAGE.BASE) ||
      path.startsWith(ROUTES.MODERATION.BASE) ||
      path.startsWith(ROUTES.PROJECTS.CREATE)
    ) {
      currentActive = 'mySpace';
    }
    
    setActive(currentActive);

    const el = currentActive ? refs[currentActive].current : null;

    if (el) {
      setSelectorStyle({
        left: el.offsetLeft,
        width: el.offsetWidth,
        opacity: 1
      });
    } else {
      setSelectorStyle(prev => ({ ...prev, opacity: 0 }));
    }
  }, [path]);


  const square = (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="16" height="16" rx="4" />
    </svg>
  );

  const handleClick = (active: Tab, routes: string, status: AuthStatus) => {
    setActive(active)
    if (status !== 'authenticated') {
      navigate(ROUTES.LOGIN)
    } else {
      navigate(routes)
    }
  }

  return (
    <nav className={styles.body}>
      <div
          className={styles.selector}
          style={{ left: selectorStyle.left, width: selectorStyle.width, opacity: selectorStyle.opacity }}
      />
      <div
        className={`${styles.button} ${styles.catalog} ${active === 'projects' ? styles.active : ''}`}
        ref={refs.projects}
        onClick={
          () => handleClick('projects', ROUTES.PROJECTS.BASE, status)
        }
      >
        {square}Проекты
      </div>
      <div
        className={`${styles.button} ${styles.mySpace} ${active === 'mySpace' ? styles.active : ''}`}
        ref={refs.mySpace}
        onClick={
          () => handleClick('mySpace', ROUTES.MAIN, status)
        }
      >
        {square}Моя Платформа
      </div>
      <div
        className={`${styles.button} ${styles.research}`}
        // className={`${styles.button} ${styles.research} ${active === 'research' ? styles.active : ''}`}
        // ref={refs.research}
        // onClick={() => setActive('research')}
      >
        {square}Исследования
      </div>
    </nav>
  );
}
import { useState, useRef, useEffect } from 'react';
import styles from './SwitchWorkSpace.module.css';
import { useNavigate, useLocation } from 'react-router-dom';

export default function SwitchWorkSpace() {
  type Tab = 'catalog' | 'mySpace' | null;
  const [active, setActive] = useState<Tab>(null);
  const [selectorStyle, setSelectorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const navigate = useNavigate();
  const location = useLocation();

  const refs = {
    catalog: useRef<HTMLDivElement>(null),
    mySpace: useRef<HTMLDivElement>(null),
  };

  const path = location.pathname;

  useEffect(() => {
    let currentActive: Tab = null;
    if (path.includes('catalog')) {
      currentActive = 'catalog';
    } else if (path.includes('my-platform')) {
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

  return (
    <nav className={styles.body}>
      <div
          className={styles.selector}
          style={{ left: selectorStyle.left, width: selectorStyle.width, opacity: selectorStyle.opacity }}
      />
      <div
        className={`${styles.button} ${styles.catalog} ${active === 'catalog' ? styles.active : ''}`}
        ref={refs.catalog}
        onClick={
          () => {
            setActive('catalog')
            navigate('/catalog')
          }
        }
      >
        {square}Проекты
      </div>
      <div
        className={`${styles.button} ${styles.mySpace} ${active === 'mySpace' ? styles.active : ''}`}
        ref={refs.mySpace}
        onClick={
          () => {
            setActive('mySpace')
            navigate('/my-platform')
          }
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
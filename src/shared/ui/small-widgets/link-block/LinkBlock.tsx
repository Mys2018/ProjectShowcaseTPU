import OpenIcon from '../../icons/open.svg?react';

import styles from './LinkBlock.module.css';
import { isSafeExternalUrl } from '@/shared/lib';

interface LinkBlockProps {
  title: string,
  service: string,
  link: string,
}


export const LinkBlock = ({title, service, link} : LinkBlockProps) => {
  // Данные приходят с бэкенда: не доверяем схеме на рендере
  const safeLink = isSafeExternalUrl(link) ? link : undefined;

  return (
    <div className={styles.body}>
      <p className={styles.title}>{title}</p>
      <a
        className={styles.linkBlock}
        href={safeLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        <p className={styles.service}>{service}</p>
        <OpenIcon className={styles.openIcon} />

      </a>
    </div>
  )
}
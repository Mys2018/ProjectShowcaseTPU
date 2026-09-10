import OpenIcon from '../../icons/open.svg?react';

import styles from './LinkBlock.module.css';

interface LinkBlockProps {
  title: string,
  service: string,
  link: string,
}


export const LinkBlock = ({title, service, link} : LinkBlockProps) => {
  return (
    <div className={styles.body}>
      <p className={styles.title}>{title}</p>
      <a
        className={styles.linkBlock}
        href={link}
        target="_blank"
        rel="noopener noreferrer"
      >
        <p className={styles.service}>{service}</p>
        <OpenIcon className={styles.openIcon} />

      </a>
    </div>
  )
}
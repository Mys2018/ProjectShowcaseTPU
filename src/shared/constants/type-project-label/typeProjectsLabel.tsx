import styles from './typeProjectsLabel.module.css';
import type { ProjectFormat } from '@/entities/project/model/types.ts';
import FolderIcon from '@/shared/ui/icons/folder.svg?react';
import CodeIcon from '@/shared/ui/icons/code.svg?react';
import StudyIcon from '@/shared/ui/icons/studyIcon.svg?react'

export const typeProjectsLabel = (type: ProjectFormat) => {
  switch (type) {
    case 'Case':
      return <div className={`${styles.base} ${styles.case}`}><FolderIcon/>Кейсовый</div>;
    case 'Study':
      return <div className={`${styles.base} ${styles.study}`}><StudyIcon/>Учебный</div>;
    case 'Real':
      return <div className={`${styles.base} ${styles.real}`}><CodeIcon/>Реальный</div>;
    default:
      return null;
  }
};

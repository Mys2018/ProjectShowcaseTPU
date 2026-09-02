import clsx from 'clsx';
import styles from './BackLink.module.css';
import BackIcon from '../icons/back.svg?react';
import { useBack } from '../../model/usePageHistory';

interface BackLinkProps {
  /** Куда вернуть, если пользователь пришёл по прямой ссылке и истории нет. */
  fallback: string;
  /** Позиционирование остаётся за страницей — здесь только сама ссылка. */
  className?: string;
}

/**
 * Стрелка «назад» с названием страницы, к которой она ведёт. Название берётся
 * из словаря backTargets по предыдущему адресу в истории.
 */
export function BackLink({ fallback, className }: BackLinkProps) {
  const { label, go } = useBack(fallback);

  return (
    <button type="button" className={clsx(styles.link, className)} onClick={go} title={label}>
      <BackIcon className={styles.icon} />
      <span className={styles.text}>{label}</span>
    </button>
  );
}

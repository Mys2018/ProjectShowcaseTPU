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
 *
 * Глазами направление читается по стрелке, а скринридер её не озвучивает —
 * поэтому вслух кнопка представляется полностью. Двоеточие вместо предлога:
 * иначе название пришлось бы склонять, а весь смысл словаря в том, что
 * названия лежат в нём ровно так, как написаны в интерфейсе.
 */
export function BackLink({ fallback, className }: BackLinkProps) {
  const { label, go } = useBack(fallback);

  return (
    <button
      type="button"
      className={clsx(styles.link, className)}
      onClick={go}
      aria-label={label ? `Назад: ${label}` : 'Назад'}
      title={label}
    >
      <BackIcon className={styles.icon} />
      <span className={styles.text}>{label}</span>
    </button>
  );
}

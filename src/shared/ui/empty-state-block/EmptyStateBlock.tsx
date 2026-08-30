import styles from './EmptyStateBlock.module.css';
import clsx from "clsx";
import { AddOutlineButton } from '@/shared/ui';

interface EmptyStateBlockProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onAddClick: () => void;
  errorState?: boolean;
  firstTime?: boolean
}

export const EmptyStateBlock = ({ title, description, buttonText, onAddClick, errorState, firstTime }: EmptyStateBlockProps) => {
  return (
    <div className={clsx(styles.emptyStateBlock, errorState ? styles.errorState : '', firstTime && styles.yellowBlinking) }>
      {(title || description) && (
        <div className={styles.textBlock}>
          {title && <h4>{title}</h4>}
          {description && <p>{description}</p>}
        </div>
      )}
      {
        buttonText && <AddOutlineButton
          text={buttonText}
          onClick={onAddClick}
        />
      }
    </div>
  );
};

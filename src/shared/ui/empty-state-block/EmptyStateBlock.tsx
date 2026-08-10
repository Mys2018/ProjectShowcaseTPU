import styles from './EmptyStateBlock.module.css';
import { AddOutlineButton } from '@/shared/ui';

interface EmptyStateBlockProps {
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  buttonText: string;
  onAddClick: () => void;
}

export const EmptyStateBlock = ({ title, description, buttonText, onAddClick }: EmptyStateBlockProps) => {
  return (
    <div className={styles.emptyStateBlock}>
      {(title || description) && (
        <div className={styles.textBlock}>
          {title && <h4>{title}</h4>}
          {description && <p>{description}</p>}
        </div>
      )}
      <AddOutlineButton
        text={buttonText}
        onClick={onAddClick}
      />
    </div>
  );
};

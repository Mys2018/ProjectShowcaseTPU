import styles from './EmptyStateBlock.module.css';
import { AddOutlineButton } from '@/shared/ui';
import clsx from "clsx";

interface EmptyStateBlockProps {
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  buttonText?: string;
  onAddClick: () => void;
  errorState: boolean
}

export const EmptyStateBlock = ({ title, description, buttonText, onAddClick, errorState }: EmptyStateBlockProps) => {
  console.log(errorState)

  return (
    <div className={clsx(styles.emptyStateBlock, errorState ? styles.errorState : '') }>
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

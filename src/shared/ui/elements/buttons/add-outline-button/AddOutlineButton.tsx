import styles from './AddOutlineButton.module.css';
import Plus from '@/shared/ui/icons/plus.svg?react';
import clsx from 'clsx';

interface AddOutlineButtonProps {
  text: string;
  onClick: () => void;
  className?: string;
}

export const AddOutlineButton = ({ text, onClick, className }: AddOutlineButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(styles.addOutlineButton, className)}
    >
      <Plus />
      {text}
    </button>
  );
};

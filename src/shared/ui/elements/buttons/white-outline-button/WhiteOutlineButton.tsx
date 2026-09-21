import styles from './WhiteOutlineButton.module.css';
import clsx from 'clsx';

interface AddOutlineButtonProps {
  text: string;
  onClick: () => void;
  className?: string;
}

export const WhiteOutlineButton = ({ text, onClick, className }: AddOutlineButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(styles.whiteButton, className)}
    >
      {text}
    </button>
  );
};

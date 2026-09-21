import styles from './InviteActionButton.module.css'
import Check from '@/shared/ui/icons/check.svg?react'

export type InviteActionButtonType = 'Invite' | 'InviteRejected' | 'AlreadyInCommand' | 'FeedbackResponse';

interface InviteActionButtonProps {
  type: InviteActionButtonType | string;
  onClick?: () => void;
}

export const InviteActionButton = ({type, onClick}: InviteActionButtonProps) => {
  switch (type) {
    case 'Invite':
      return <button type="button" className={styles.inviteBtn} onClick={onClick}>Пригласить</button>;
    case 'InviteRejected':
      return <button type="button" className={styles.inviteRejectedBtn} onClick={onClick}>Приглашение отклонено</button>;
    case 'AlreadyInCommand':
      return <button type="button" className={styles.alreadyInCommandBtn} onClick={onClick}>Уже в команде</button>;
    case 'FeedbackResponse':
      return (
        <div className={styles.feedbackResponseContainer}>
          <p>Уже откликнулся</p>
          <button type="button" className={styles.feedbackResponseBtn} onClick={onClick}>
            <Check /> Принять отклик
          </button>
        </div>
      );
    default:
      return null;
  }
};


import styles from './InviteActionButton.module.css'

interface InviteActionButtonProps {
  type: string;
  onClick?: () => void;
}

export const InviteActionButton = ({type, onClick}: InviteActionButtonProps) => {
  switch (type) {
    case 'Invite':
      return <button className={styles.inviteBtn} onClick={onClick}>Пригласить</button>;
    case 'InviteRejected':
      return <button className={styles.inviteRejectedBtn} onClick={onClick}>Приглашение отклонено</button>;
    case 'AlreadyInCommand':
      return <button className={styles.alreadyInCommandBtn} onClick={onClick}>Уже в команде</button>;
    case 'FeedbackResponse':
      return <button className={styles.feedbackResponseBtn} onClick={onClick}>Уже откликнулся</button>;
  }
};


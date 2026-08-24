import styles from './FeedBackButton.module.css'

interface FeedBackButtonProps {
  isActiveFeedBack: boolean
  toggleFeedBack: () => void;
  disabled: boolean;
}

export const FeedBackButton = ({isActiveFeedBack, toggleFeedBack, disabled}: FeedBackButtonProps) => {
  return (
    <button
      className={`${styles.button} ${isActiveFeedBack ? styles.activeButton : ''}`}
      onClick={toggleFeedBack}
      disabled={disabled}
    >
      {isActiveFeedBack ? 'Отменить отклик' : 'Откликнуться'}
    </button>
  )
}

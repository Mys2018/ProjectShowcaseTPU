import styles from './FeedBackButton.module.css'

interface FeedBackButtonProps {
  isActiveFeedBack: boolean
  toggleFeedBack: () => void;
  disabled: boolean;
  isInTeam?: boolean;
  customText?: string;
}

export const FeedBackButton = ({
  isActiveFeedBack,
  toggleFeedBack,
  disabled,
  isInTeam,
  customText
}: FeedBackButtonProps) => {
  const text = customText || (
    isInTeam
      ? 'Вы в команде'
      : isActiveFeedBack
        ? 'Отменить отклик'
        : 'Откликнуться'
  )

  return (
    <button
      className={`${styles.button} ${
        isInTeam ? styles.inTeamButton : isActiveFeedBack ? styles.activeButton : ''
      }`}
      onClick={toggleFeedBack}
      disabled={disabled}
    >
      {text}
    </button>
  )
}

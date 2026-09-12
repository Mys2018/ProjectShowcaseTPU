import styles from './InviteUserButton.module.css'
import AddUserIcon from '@/shared/ui/icons/addUser.svg?react'
import clsx from 'clsx'

interface InviteUserButtonProps {
  onClick: () => void
  className?: string
  iconOnly?: boolean
}

export const InviteUserButton = ({ onClick, className, iconOnly }: InviteUserButtonProps) => {
  if (iconOnly) {
    return (
      <button type="button" className={clsx(styles.iconBtn, className)} onClick={onClick}>
        <AddUserIcon className={styles.inviteIconOnly} />
      </button>
    )
  }

  return (
    <button type="button" className={clsx(styles.inviteUserBtn, className)} onClick={onClick}>
      <AddUserIcon className={styles.inviteIcon} />
      Пригласить пользователя
    </button>
  )
}

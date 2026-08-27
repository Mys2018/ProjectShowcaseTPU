import clsx from 'clsx'
import styles from './LikeProjectButton.module.css'
import LikeIcon from '../assets/like.svg?react'
import { useToggleLikeProject } from '../api/mutations'
import type { MouseEventHandler } from 'react'

interface LikeProjectButtonProps {
  projectId: string
  liked: boolean
  className?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export function LikeProjectButton({ projectId, liked, className, onClick }: LikeProjectButtonProps) {
  const { mutate: toggleLikeProject } = useToggleLikeProject(liked)
  return (
    <button
      type='button'
      className={clsx(styles.button, liked && styles.active, className)}
      onClick={e => {
        toggleLikeProject(projectId)
        onClick?.(e)
      }}
    >
      <LikeIcon className={styles.like} />
    </button>
  )
}

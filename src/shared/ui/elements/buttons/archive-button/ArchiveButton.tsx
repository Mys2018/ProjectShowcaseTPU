import styles from './ArchiveButton.module.css'
import ArchiveIcon from '@/shared/ui/icons/archive.svg?react'
import clsx from "clsx";

type Color = 'red' | 'grey'

interface ArchiveButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  color: Color;
  disabled?: boolean;
}

const getColor = (color: Color) => {
  switch (color) {
    case 'red':
      return styles.red;
    case 'grey':
      return styles.grey;
    default:
      return styles.grey;
  }
}

export const ArchiveButton = ({onClick, color, disabled}: ArchiveButtonProps) => {
  return (
    <button
      className={clsx(styles.archiveButton, getColor(color))}
      onClick={onClick}
      disabled={disabled}
    >
      <ArchiveIcon/> Архивировать проект
    </button>
  )
}

import styles from './ArchiveButton.module.css'
import ArchiveIcon from '@/shared/ui/icons/archive.svg?react'
import clsx from "clsx";

type Color = 'red' | 'grey'

interface ArchiveButtonProps {
  onClick?: () => void;
  color: Color;
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

export const ArchiveButton = ({onClick, color}: ArchiveButtonProps) => {
  return (
    <button className={clsx(styles.archiveButton, getColor(color))} onClick={onClick}> <ArchiveIcon/> Архивировать проект </button>
  )
}

import styles from './PopupMenu.module.css'
import {type ReactNode, useRef, useState} from "react";
import {useClickOutside} from "@/shared/lib/hooks/useClickOutside.ts";
import clsx from "clsx";

interface PopupMenuProps {
  trigger: ReactNode,
  children: ReactNode,
  popupClassName?: string,
}

export const PopupMenu = ({trigger, children, popupClassName}: PopupMenuProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false), open);

  return (
    <div ref={ref} className={styles.container}>
      <div className={styles.triggerWrapper} onClick={() => setOpen(v => !v)}>{trigger}</div>
      {open && <div className={clsx(styles.dropdownMenu, popupClassName) } onClick={() => setOpen(false)}>{children}</div>}
    </div>
  )
}

interface PopupMenuRowProps {
  children?: ReactNode,
  title: string,
  onClick: () => void,
  isActive?: boolean
}

PopupMenu.Row = ({children, title, onClick, isActive} :PopupMenuRowProps) => {
  return (
    <button type="button" className={`${styles.dropdownItem} ${isActive ? styles.dropdownItemActive : ''}`} onClick={onClick}>
      {children}
      {title}
    </button>
  )
}

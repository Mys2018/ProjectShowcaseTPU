import styles from './PopupMenu.module.css'
import {type ReactNode, useRef, useState} from "react";
import {useClickOutside} from "@/shared/lib/hooks/useClickOutside.ts";

interface PopupMenuProps {
  trigger: ReactNode,
  children: ReactNode
}

export const PopupMenu = ({trigger, children}: PopupMenuProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false), open);

  return (
    <div ref={ref} className={styles.container}>
      <div className={styles.triggerWrapper} onClick={() => setOpen(v => !v)}>{trigger}</div>
      {open && <div className={styles.dropdownMenu} onClick={() => setOpen(false)}>{children}</div>}
    </div>
  )
}

interface PopupMenuRowProps {
  children: ReactNode,
  title: string,
  onClick: () => void
}

PopupMenu.Row = ({children, title, onClick} :PopupMenuRowProps) => {
  return (
    <button type="button" className={styles.dropdownItem} onClick={onClick}>
      {children}
      {title}
    </button>
  )
}

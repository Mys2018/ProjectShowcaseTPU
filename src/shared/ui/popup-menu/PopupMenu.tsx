import styles from './PopupMenu.module.css'
import {type ReactNode, useRef, useState} from "react";
import {useClickOutside} from "@/shared/lib/hooks/useClickOutside.ts";
import clsx from "clsx";

interface PopupMenuProps {
  trigger: ReactNode,
  children: ReactNode,
  popupClassName?: string,
  open?: boolean,
  onOpenChange?: (open: boolean) => void,
  closeOnClick?: boolean,
}

export const PopupMenu = ({trigger, children, popupClassName, open: controlledOpen, onOpenChange, closeOnClick = true}: PopupMenuProps) => {
  const isControlled = controlledOpen !== undefined;
  const [innerOpen, setInnerOpen] = useState(false);
  const open = isControlled ? controlledOpen : innerOpen;
  const setOpen = (v: boolean) => {
    if (isControlled) onOpenChange?.(v);
    else setInnerOpen(v);
  };
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false), open);

  return (
    <div ref={ref} className={styles.container}>
      <div className={styles.triggerWrapper} onClick={() => setOpen(!open)}>{trigger}</div>
      {open && <div className={clsx(styles.dropdownMenu, popupClassName)} onClick={() => closeOnClick && setOpen(false)}>{children}</div>}
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

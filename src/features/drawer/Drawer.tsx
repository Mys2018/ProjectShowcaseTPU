import styles from './Drawer.module.css'
import {type ReactNode, type TouchEvent, useEffect, useRef, useState} from "react";
import clsx from "clsx";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  variant?: 'violet' | 'gray50';
  className?: string;
  sheetClassName?: string;
  showHandle?: boolean;
}

export const Drawer = ({
  isOpen,
  onClose,
  children,
  variant = 'violet',
  className,
  sheetClassName,
  showHandle = true,
}: DrawerProps) => {

  const [dragY, setDragY] = useState(0)
  const startY = useRef(0)
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setDragY(0), 350)
      return () => clearTimeout(timer)
    }
  }, [isOpen]);

  useEffect(() => {
    const isScrollableAtTop = (target: EventTarget | null): boolean => {
      let element = target as HTMLElement | null
      while (element && element !== sheetRef.current) {
        if (element.scrollHeight > element.clientHeight && element.scrollTop > 0) {
          return false
        }
        element = element.parentElement
      }
      return true
    }

    const handleTouchMoveNative = (e: globalThis.TouchEvent) => {
      const currentY = e.touches[0].clientY
      const diff = currentY - startY.current

      if (diff > 0 && isScrollableAtTop(e.target)) {
        if (e.cancelable) {
          e.preventDefault()
        }
        setDragY(diff)
      }
    }

    const sheet = sheetRef.current
    if (sheet) {
      sheet.addEventListener('touchmove', handleTouchMoveNative, { passive: false })
    }

    return () => {
      if (sheet) {
        sheet.removeEventListener('touchmove', handleTouchMoveNative)
      }
    }
  }, [])

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    startY.current = e.touches[0].clientY
  }

  const handleTouchEnd = () => {
    if (dragY > 120) {
      onClose()
    } else {
      setDragY(0)
    }
  }

  return (
    <div className={clsx(styles.overlay, isOpen && styles.open, className)}>
      <div className={styles.backdrop} onClick={onClose}/>

      <div
        className={clsx(styles.sheet, styles[variant], sheetClassName)}
        ref={sheetRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: isOpen ? `translateY(${dragY}px)` : 'translateY(100%)',
          transition: dragY > 0 ? 'none' : 'transform 0.35s ease-out',
        }}
      >
        {showHandle && <div className={styles.dragHandle}/>}
        {children}
      </div>

    </div>
  )
}
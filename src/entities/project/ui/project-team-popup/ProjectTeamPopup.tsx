import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import styles from './ProjectTeamPopup.module.css';

export interface ProjectTeamPopupProps {
  title?: string;
  children: ReactNode;
  trigger?: ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  onToggle?: () => void;
  className?: string;
  popupClassName?: string;
  triggerOn?: 'hover' | 'click' | 'both';
  closeDelayMs?: number;
}

export const ProjectTeamPopup = ({
  title = 'Команда проекта',
  children,
  trigger,
  isOpen: controlledIsOpen,
  onClose,
  onToggle,
  className,
  popupClassName,
  triggerOn = 'hover',
  closeDelayMs = 150,
}: ProjectTeamPopupProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const open = isControlled ? controlledIsOpen : internalIsOpen;

  const triggerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const clearCloseTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const updateCoords = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popupEstimatedWidth = 340;
    const popupEstimatedHeight = 350;

    let left = rect.left;
    if (left + popupEstimatedWidth > window.innerWidth - 16) {
      left = Math.max(16, window.innerWidth - popupEstimatedWidth - 16);
    }

    let top = rect.bottom + 8;
    if (top + popupEstimatedHeight > window.innerHeight - 16 && rect.top - popupEstimatedHeight - 8 > 16) {
      top = rect.top - popupEstimatedHeight - 8;
    }

    setCoords({ top, left });
  }, []);

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
    if (!isControlled) {
      setInternalIsOpen(false);
    }
  }, [onClose, isControlled]);

  const handleMouseEnter = useCallback(() => {
    if (triggerOn === 'click') return;
    clearCloseTimeout();
    updateCoords();
    if (!isControlled) {
      setInternalIsOpen(true);
    }
  }, [triggerOn, clearCloseTimeout, updateCoords, isControlled]);

  const handleMouseLeave = useCallback(() => {
    if (triggerOn === 'click') return;
    clearCloseTimeout();
    timeoutRef.current = setTimeout(() => {
      handleClose();
    }, closeDelayMs);
  }, [triggerOn, clearCloseTimeout, closeDelayMs, handleClose]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (triggerOn === 'hover') return;
    if (onToggle) {
      onToggle();
    } else if (!isControlled) {
      setInternalIsOpen(prev => {
        const next = !prev;
        if (next) updateCoords();
        return next;
      });
    }
  };

  useEffect(() => {
    return () => {
      clearCloseTimeout();
    };
  }, [clearCloseTimeout]);

  useEffect(() => {
    if (open) {
      updateCoords();
      const handleScrollOrResize = () => {
        updateCoords();
      };
      window.addEventListener('scroll', handleScrollOrResize, true);
      window.addEventListener('resize', handleScrollOrResize);
      return () => {
        window.removeEventListener('scroll', handleScrollOrResize, true);
        window.removeEventListener('resize', handleScrollOrResize);
      };
    }
  }, [open, updateCoords]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        popupRef.current &&
        !popupRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        handleClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, handleClose]);

  if (!trigger) {
    if (!open) return null;
    return (
      <div
        ref={popupRef}
        className={clsx(styles.popup, className, popupClassName)}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {title && <h3 className={styles.title}>{title}</h3>}
        <div className={styles.content}>{children}</div>
      </div>
    );
  }

  return (
    <div
      ref={triggerRef}
      className={clsx(styles.triggerWrapper, className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {trigger}
      {open &&
        createPortal(
          <div
            ref={popupRef}
            className={clsx(styles.popup, popupClassName)}
            style={{
              position: 'fixed',
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              zIndex: 1000,
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {title && <h3 className={styles.title}>{title}</h3>}
            <div className={styles.content}>{children}</div>
          </div>,
          document.body
        )}
    </div>
  );
};

import { useState, useRef, useEffect, useLayoutEffect, useCallback, type ReactNode } from 'react';
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
  /** Отступ от триггера до попапа, px. */
  gap?: number;
  /** Минимальный отступ попапа от краёв окна, px. */
  viewportPadding?: number;
}

const DEFAULT_GAP = 8;
const DEFAULT_PADDING = 16;

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
  gap = DEFAULT_GAP,
  viewportPadding = DEFAULT_PADDING,
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

  /**
   * Позиция считается ПОСЛЕ монтирования попапа — по его реальным размерам,
   * а не по захардкоженной оценке. Раньше константы 340×350 врали в обе
   * стороны: короткий список навыков «переворачивался» вверх без нужды,
   * длинная команда улетала за низ экрана. Вызывается и при каждом рендере
   * открытого попапа (useLayoutEffect), поэтому догрузка контента тоже
   * пересчитывает позицию до отрисовки.
   */
  const updateCoords = useCallback(() => {
    const triggerEl = triggerRef.current;
    const popupEl = popupRef.current;
    if (!triggerEl) return;

    const rect = triggerEl.getBoundingClientRect();
    // До первого монтирования реального размера нет — берём консервативную
    // оценку, чтобы первый кадр не выл за экран; следующий useLayoutEffect
    // уточнит по фактическим размерам.
    const popupWidth = popupEl?.offsetWidth ?? 320;
    const popupHeight = popupEl?.offsetHeight ?? 200;

    const maxLeft = window.innerWidth - viewportPadding - popupWidth;
    const left = Math.min(Math.max(viewportPadding, rect.left), Math.max(viewportPadding, maxLeft));

    let top = rect.bottom + gap;
    const fitsBelow = top + popupHeight <= window.innerHeight - viewportPadding;
    const fitsAbove = rect.top - gap - popupHeight >= viewportPadding;

    if (!fitsBelow && fitsAbove) {
      top = rect.top - gap - popupHeight;
    } else if (!fitsBelow && !fitsAbove) {
      // Не влезает ни вверх, ни вниз — прижимаем к видимой части окна,
      // контент попапа скроллится внутри.
      top = Math.max(viewportPadding, window.innerHeight - viewportPadding - popupHeight);
    }

    // Без сравнения useLayoutEffect-цикл «update → рендер → update» не
    // останавливался бы: новый объект coords всегда вызывает рендер.
    setCoords(prev => (prev.top === top && prev.left === left ? prev : { top, left }));
  }, [gap, viewportPadding]);

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
    if (!isControlled) {
      setInternalIsOpen(true);
    }
  }, [triggerOn, clearCloseTimeout, isControlled]);

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
      // Никаких побочных эффектов в апдейтере: координаты считает
      // useLayoutEffect после монтирования.
      setInternalIsOpen(prev => !prev);
    }
  };

  // Позиция при каждом рендере открытого попапа: и первый кадр, и рост контента.
  useLayoutEffect(() => {
    if (!open) return;
    updateCoords();
  });

  useEffect(() => {
    return () => {
      clearCloseTimeout();
    };
  }, [clearCloseTimeout]);

  useEffect(() => {
    if (!open) return;
    const handleScrollOrResize = (e: Event) => {
      // Скролл внутри самого попапа (.content overflow-y) не должен
      // дёргать позицию — раньше capture-слушатель ловил и его.
      if (e.type === 'scroll' && popupRef.current?.contains(e.target as Node)) return;
      updateCoords();
    };
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
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

import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import BulbIcon from '../icons/bulb.svg?react';
import HelpIcon from '../icons/help_icons.svg?react';
import ImportantIcon from '../icons/important.svg?react';
import QuestionIcon from '../icons/question.svg?react';
import styles from './InfoTooltip.module.css';

type SizeTooltip = 'small' | 'large'
type Pointer = 'topLeft' | 'bottomLeft' | 'topRight' | 'bottomRight'

interface InfoTooltipProps {
  className?: string;
  iconClassName?: string;
  children?: React.ReactNode;
  title?: string;
  body: {
    subtitle?: string;
    text?: string[];
  }[]
  size: SizeTooltip;
  importantText?: string;
  link?: string;
  type?: 'question' | 'help' | 'bulb';
  pointer: Pointer;

  greenButtonText?: string;
  onClickGreenButtonText?: () => void;

  image?: string;
}

const THEME_MAP: Record<SizeTooltip, {
  title: string;
  subtitle: string;
  text: string;
  important: string;
  link: string;
  tooltipBg: string;
}> = {
  small: {
    title: styles.titleSmall,
    subtitle: styles.subtitleSmall,
    text: styles.textSmall,
    important: styles.importantSmall,
    link: styles.linkSmall,
    tooltipBg: styles.tooltipSmall
  },
  large: {
    title: styles.titleLarge,
    subtitle: styles.subtitleLarge,
    text: styles.textLarge,
    important: styles.importantLarge,
    link: styles.linkLarge,
    tooltipBg: styles.tooltipLarge
  }
};

const getIconByType = (type: string, classNames: string) => {
  switch (type) {
    case 'question':
      return <QuestionIcon className={classNames} />;
    case 'help':
      return <HelpIcon className={classNames} />;
    case 'bulb':
      return <BulbIcon className={classNames} />;
  }
};

export const InfoTooltip = ({
  children,
  className,
  iconClassName,
  title,
  body,
  size,
  importantText,
  pointer,
  type,
  greenButtonText,
  onClickGreenButtonText,
  image
}: InfoTooltipProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [placement, setPlacement] = useState<'top' | 'bottom'>('bottom');
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: -9999, left: -9999 });

  const triggerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const s = THEME_MAP[size];

  const updateCoords = useCallback(() => {
    const triggerEl = triggerRef.current;
    const popupEl = popupRef.current;
    if (!triggerEl) return;

    const rect = triggerEl.getBoundingClientRect();
    const popupWidth = popupEl?.offsetWidth ?? (size === 'large' ? 300 : 172);
    const popupHeight = popupEl?.offsetHeight ?? 80;

    const GAP = 8;
    const VIEWPORT_PADDING = 8;

    let top = 0;
    let left = 0;
    let currentPlacement: 'top' | 'bottom' = 'bottom';

    // Вертикальное позиционирование
    if (pointer.startsWith('top')) {
      const fitsBelow = rect.bottom + GAP + popupHeight <= window.innerHeight - VIEWPORT_PADDING;
      const fitsAbove = rect.top - GAP - popupHeight >= VIEWPORT_PADDING;

      if (!fitsBelow && fitsAbove) {
        top = rect.top - GAP - popupHeight;
        currentPlacement = 'top';
      } else {
        top = rect.bottom + GAP;
        currentPlacement = 'bottom';
      }
    } else {
      const fitsAbove = rect.top - GAP - popupHeight >= VIEWPORT_PADDING;
      const fitsBelow = rect.bottom + GAP + popupHeight <= window.innerHeight - VIEWPORT_PADDING;

      if (!fitsAbove && fitsBelow) {
        top = rect.bottom + GAP;
        currentPlacement = 'bottom';
      } else {
        top = rect.top - GAP - popupHeight;
        currentPlacement = 'top';
      }
    }

    // Горизонтальное позиционирование
    const anchorX = type
      ? rect.left + rect.width / 2
      : (pointer.includes('Right') ? rect.right : rect.left);

    if (pointer === 'topLeft' || pointer === 'bottomLeft') {
      left = anchorX;
    } else {
      left = anchorX - popupWidth;
    }

    // Ограничение границами экрана (чтобы тултип никогда не обрезался)
    const minLeft = VIEWPORT_PADDING;
    const maxLeft = Math.max(minLeft, window.innerWidth - popupWidth - VIEWPORT_PADDING);
    left = Math.min(Math.max(minLeft, left), maxLeft);

    const minTop = VIEWPORT_PADDING;
    const maxTop = Math.max(minTop, window.innerHeight - popupHeight - VIEWPORT_PADDING);
    top = Math.min(Math.max(minTop, top), maxTop);

    setPlacement(currentPlacement);
    setCoords(prev => (prev.top === top && prev.left === left ? prev : { top, left }));
  }, [pointer, size, type]);

  useLayoutEffect(() => {
    if (!isMounted) return;
    updateCoords();
    setIsVisible(true);
  }, [isMounted, updateCoords]);

  useEffect(() => {
    if (!isMounted) return;
    const handleScrollOrResize = (e: Event) => {
      if (e.type === 'scroll' && popupRef.current?.contains(e.target as Node)) return;
      updateCoords();
    };
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isMounted, updateCoords]);

  useEffect(() => {
    if (!isMounted) return;
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        popupRef.current &&
        !popupRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setIsVisible(false);
        fadeTimeoutRef.current = setTimeout(() => {
          setIsMounted(false);
        }, 200);
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [isMounted]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }

    if (!isMounted) {
      setIsMounted(true);
    } else {
      updateCoords();
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      fadeTimeoutRef.current = setTimeout(() => {
        setIsMounted(false);
      }, 200);
    }, 180);
  };

  return (
    <div
      ref={triggerRef}
      className={clsx(styles.tooltipBody, className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {type ? getIconByType(type, iconClassName || '') : children}

      {isMounted &&
        createPortal(
          <div
            ref={popupRef}
            className={clsx(
              styles.tooltip,
              s.tooltipBg,
              styles[pointer],
              placement === 'bottom' ? styles.placedBelow : styles.placedAbove,
              isVisible && styles.visible
            )}
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {title && (
              <p className={clsx(styles.title, s.title)}>
                {title}
              </p>
            )}

            {image && <img className={styles.img} src={image} alt="Картинка" />}

            {body.map((block, index) => (
              <div key={index} className={styles.block}>
                {block.subtitle && (
                  <p className={clsx(styles.subtitle, s.subtitle)}>
                    {block.subtitle}
                  </p>
                )}
                <div className={styles.textList}>
                  {block.text?.map((text, idx) => (
                    <p key={idx} className={clsx(styles.text, s.text)}>
                      {text}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            {importantText && (
              <div className={styles.importantBlock}>
                <ImportantIcon />
                <p className={clsx(styles.important, s.important)}>
                  {importantText}
                </p>
              </div>
            )}

            {greenButtonText && onClickGreenButtonText && (
              <button className={styles.greenButton} onClick={onClickGreenButtonText}>
                {greenButtonText}
              </button>
            )}
          </div>,
          document.body
        )}
    </div>
  );
};
import styles from './Modal.module.css'
import type {ReactNode} from "react";
import { useRef } from 'react';

type ModalProps = {
  isOpen: boolean,
  onClose: () => void,
  children: ReactNode,
  variant?: 'default' | 'transparent'
}

export function Modal({ isOpen, onClose, children, variant = 'default' }: ModalProps) {
  const isOverlayClicked = useRef(false);

  if (!isOpen) return null;

  const contentClass = `${styles.content} ${variant === 'transparent' ? styles.transparentContent : ''}`

  return (
    <div 
      className={styles.overlay} 
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          isOverlayClicked.current = true;
        }
      }}
      onMouseUp={(e) => {
        if (isOverlayClicked.current && e.target === e.currentTarget) {
          onClose();
        }
        isOverlayClicked.current = false;
      }}
    >
      <div className={contentClass}>
        {children}
      </div>
    </div>
  )
}

Modal.Header = ({title, subtitle}: { title?: string; subtitle?: string }) => (
  <div className={styles.header}>
    <h2 className={styles.title}>{title}</h2>
    {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
  </div>
)

Modal.SpecialBlock = ({ children }: { children: ReactNode }) => (
  <div className={styles.body}>{children}</div>
);

Modal.Body = ({ children }: { children: ReactNode }) => (
  <div className={styles.body}>{children}</div>
);

Modal.Footer = ({ children }: { children: ReactNode }) => (
  <div className={styles.footer}>{children}</div>
);
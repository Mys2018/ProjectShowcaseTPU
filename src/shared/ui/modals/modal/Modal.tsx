import styles from './Modal.module.css'
import type {ReactNode} from "react";

type ModalProps = {
  isOpen: boolean,
  onClose: () => void,
  children: ReactNode,
  variant?: 'default' | 'transparent'
}

export function Modal({ isOpen, onClose, children, variant = 'default' }: ModalProps) {
  if (!isOpen) return null;

  const contentClass = `${styles.content} ${variant === 'transparent' ? styles.transparentContent : ''}`

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={contentClass} onClick={e => e.stopPropagation()}>
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
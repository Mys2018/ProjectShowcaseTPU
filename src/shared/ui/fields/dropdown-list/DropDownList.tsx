import { useState, useRef, useEffect } from 'react';
import styles from './DropDownList.module.css';

interface DropDownListProps {
  label?: string;
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  isBlink?: boolean;
}

export const DropDownList = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Выберите...',
  error,
  isBlink,
}: DropDownListProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && listRef.current) {
      setTimeout(() => {
        listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 10);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`${styles.wrapper}`} ref={dropdownRef}>
      {label && <label className={styles.label}>{label}</label>}

      <div className={styles.selectContainer}>
        <div
          className={`${styles.trigger} ${isOpen ? styles.triggerActive : ''} ${error ? styles.triggerError : ''} ${isBlink ? 'blink-1' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={`${styles.triggerText} ${!value ? styles.triggerPlaceholder : ''}`}>
            {value || placeholder}
          </span>
          <svg
            className={`${styles.caret} ${isOpen ? styles.caretOpen : ''}`}
            width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1 1L7 7L13 1" stroke="#8A92A6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {isOpen && (
          <div className={styles.dropdown} ref={listRef}>
            {options.length === 0 && (
              <div className={styles.option}>
                <span className={styles.optionText}>Нет доступных вариантов</span>
              </div>
            )}
            {options.map(option => (
              <div
                key={option}
                className={`${styles.option} ${option === value ? styles.optionSelected : ''}`}
                onClick={() => { onChange?.(option); setIsOpen(false); }}
              >
                <span className={styles.optionText}>{option}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};


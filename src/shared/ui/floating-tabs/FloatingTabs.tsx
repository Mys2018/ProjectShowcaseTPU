import type { ReactNode } from 'react'
import styles from './FloatingTabs.module.css'

interface FloatingTabsProps<T extends string> {
  items: { label: ReactNode; value: T }[]
  value: T
  onChange: (value: T) => void
  className?: string
}

export function FloatingTabs<T extends string>({ items, value, onChange, className = '' }: FloatingTabsProps<T>) {
  return (
    <div className={`${styles.list} ${className}`}>
      {items.map(item => (
        <button
          key={item.value}
          type='button'
          className={`${styles.item} ${item.value === value ? styles.active : ''}`}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

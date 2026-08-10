import type { ReactNode } from 'react'
import styles from './FloatingTabs.module.css'

interface FloatingTabsProps {
  items: { label: ReactNode; value: string }[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export function FloatingTabs({ items, value, onChange, className = '' }: FloatingTabsProps) {
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

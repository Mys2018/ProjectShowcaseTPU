import styles from './FloatingTabs.module.css'
import clsx from 'clsx'
import type { FloatingTabItem } from '../types'

interface FloatingTabsProps<T extends string> {
  items: FloatingTabItem<T>[]
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
          className={clsx(styles.item, item.value === value && styles.active, item.notification && styles.notification)}
          onClick={() => onChange(item.value)}
        >
          <p>{item.label}</p>
        </button>
      ))}
    </div>
  )
}

import styles from './HorizontalTabs.module.css'
import type { HorizontalTabItem } from '../types'
import clsx from 'clsx'

interface HorizontalTabsProps<T extends string> {
  items: HorizontalTabItem<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}

export function HorizontalTabs<T extends string>({items, value, onChange, className,}: HorizontalTabsProps<T>) {
  return (
    <div className={clsx(styles.list, className)}>
      {items.map((item) => {
        return (
          <button
            key={item.value}
            type="button"
            className={clsx(
              styles.item,
              item.value === value && styles.active,
              item.error && styles.error,
            )}
            onClick={() => onChange(item.value)}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
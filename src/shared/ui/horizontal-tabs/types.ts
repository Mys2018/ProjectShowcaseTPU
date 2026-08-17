import type { ReactNode } from 'react'

export type HorizontalTabItem<T> = { label: ReactNode; value: T, error?: boolean }

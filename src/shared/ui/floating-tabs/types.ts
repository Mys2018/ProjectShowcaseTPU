import type { ReactNode } from 'react'

export type FloatingTabItem<T> = { label: ReactNode; value: T; notification?: boolean }

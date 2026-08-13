import { useLocation, useNavigate } from 'react-router-dom'
import styles from './RouterTabs.module.css'
import { FloatingTabs } from '../floating-tabs/FloatingTabs'

export type TabItem = {
  label: string
  to: string
}

interface RouterTabsProps {
  items: TabItem[]
}

export function RouterTabs({ items }: RouterTabsProps) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <FloatingTabs
      className={styles.routerTabs}
      items={items.map(item => ({ label: item.label, value: item.to }))}
      onChange={to => void navigate(to)}
      value={location.pathname}
    />
  )
}

import { Outlet } from 'react-router-dom'
import styles from './MainLayout.module.css'
import { Header } from '@/widgets/header'

export const MainLayout = () => {
  return (
    <main className={styles.mainLayout}>
      <Header/>
      <Outlet/>
    </main>
  )
}
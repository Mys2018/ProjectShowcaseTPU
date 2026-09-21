import styles from './ReportsModeration.module.css'
import {EmptyBlanking} from "@/shared/ui/empty-blanking";


export const ReportsModeration = () => {
  return (
    <>
      <aside className={styles.side}>
      </aside>
      <main className={styles.content}>
        <EmptyBlanking text={'Этот блок еще в разработке'}/>
      </main>
    </>
  )
}

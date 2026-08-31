import { useNavigate } from 'react-router-dom'
import styles from './NotFoundPage.module.css'
import { ROUTES } from '@/shared'
import {FilledButton} from "@/shared/ui/elements/buttons";

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.subtitle}>Страница не найдена</p>
      <p className={styles.message}>Кажется мы ошиблись на счет тебя</p>
      <FilledButton
        onClick={() => {
          navigate(ROUTES.MAIN, {replace: true})
        }}
        textButton={'Вернуться на главную'}
      />
    </div>
  )
}

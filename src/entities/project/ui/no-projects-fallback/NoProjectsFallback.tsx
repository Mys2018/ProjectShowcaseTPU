import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'
import styles from './NoProjectsFallback.module.css'
import { BlankPhoto, FilledButton, ROUTES } from '@/shared'

interface NoProjectsFallbackProps {
  title?: string
  description?: string
  className?: string
}

export function NoProjectsFallback({ title, description, className }: NoProjectsFallbackProps) {
  const navigate = useNavigate()
  const isTextBlockVisible = title || description
  return (
    <div className={clsx(styles.empty, className)}>
      <BlankPhoto />
      <div className={styles.content}>
        {isTextBlockVisible && (
          <div className={styles.description}>
            {title && <h5 className={styles.heading}>{title}</h5>}
            {description && <p className={styles.paragraph}>{description}</p>}
          </div>
        )}
        <FilledButton className={styles.catalogButton} onClick={() => void navigate(ROUTES.PROJECTS.BASE)} textButton='Выбрать проект' />
      </div>
    </div>
  )
}

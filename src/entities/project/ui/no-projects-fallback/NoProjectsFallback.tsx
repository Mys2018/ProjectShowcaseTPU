import clsx from 'clsx'
import styles from './NoProjectsFallback.module.css'
import { BlankPhoto, FilledButton } from '@/shared'
import {BluePlusVioletButton} from "@/shared/ui/elements/buttons/blue-plus-violet-button/BluePlusVioletButton.tsx";

type buttonType = 'green' | 'blue'

interface NoProjectsFallbackProps {
  title?: string
  description?: string
  buttonText?: string
  buttonType?: buttonType
  className?: string
  onClick?: () => void
}

const getButton = (type?: buttonType, onClick?: () => void, buttonText: string = 'Выбрать проект') => {
  if (!type || !onClick) return null
  switch (type) {
    case 'green':
      return <FilledButton className={styles.catalogButton} onClick={onClick} textButton={buttonText} />
    case 'blue':
      return <BluePlusVioletButton className={styles.catalogButton} onClick={onClick} textButton={buttonText} />
  }
}

export function NoProjectsFallback({ title, description, className, buttonText = 'Выбрать проект', buttonType, onClick }: NoProjectsFallbackProps) {
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
        {
          getButton(buttonType, onClick, buttonText)
        }
      </div>
    </div>
  )
}

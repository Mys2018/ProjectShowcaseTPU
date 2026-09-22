import clsx from 'clsx'
import { isValidElement, type ComponentType, type ReactNode, type SVGProps } from 'react'
import styles from './NoProjectsFallback.module.css'
import { FilledButton } from '@/shared'
import { BluePlusVioletButton } from "@/shared/ui/elements/buttons/blue-plus-violet-button/BluePlusVioletButton.tsx";

type buttonType = 'green' | 'blue'

export type ImageProp =
  | string
  | ReactNode
  | ComponentType<SVGProps<SVGSVGElement>>
  | ComponentType<{ className?: string }>

interface NoProjectsFallbackProps {
  title?: string
  description?: string
  buttonText?: string
  buttonType?: buttonType
  className?: string
  onClick?: () => void
  image?: ImageProp | null
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

export function NoProjectsFallback({
  title,
  description,
  className,
  buttonText = 'Выбрать проект',
  buttonType,
  onClick,
  image
}: NoProjectsFallbackProps) {
  const isTextBlockVisible = Boolean(title || description)

  const renderImage = () => {
    if (!image) return null

    // 1. Строка: URL или импорт пути к картинке (png/jpg/webp/svg)
    if (typeof image === 'string') {
      return <img className={styles.image} src={image} alt={title || 'Иллюстрация'} />
    }

    // 2. React-компонент, переданный по ссылке: image={NoProjectsSVG}
    if (typeof image === 'function') {
      const Component = image
      return <Component className={styles.image} />
    }

    // 3. Готовый JSX-элемент: image={<NoProjectsSVG />} или кастомный узел
    if (isValidElement(image)) {
      return <div className={styles.imageWrapper}>{image}</div>
    }

    return null
  }

  return (
    <div className={clsx(styles.empty, className)}>
      {renderImage()}

      <div className={styles.content}>
        {isTextBlockVisible && (
          <div className={styles.description}>
            {title && <h5 className={styles.heading}>{title}</h5>}
            {description && <p className={styles.paragraph}>{description}</p>}
          </div>
        )}
        {getButton(buttonType, onClick, buttonText)}
      </div>
    </div>
  )
}

import type { ReactNode } from 'react'
import clsx from 'clsx'
import styles from './CompletedProjects.module.css'

export interface CompletedProjectsProps {
  /** Заголовок в левом верхнем углу */
  title: ReactNode
  /** Компонент переключателя/свитча в правом верхнем углу */
  switchComponent?: ReactNode
  /** Алиас для switchComponent */
  switchSlot?: ReactNode
  /** Флаг отсутствия элементов */
  isEmpty?: boolean
  /** Заголовок блока при отсутствии элементов */
  emptyTitle?: ReactNode
  /** Подзаголовок блока при отсутствии элементов */
  emptySubtitle?: ReactNode
  /** Альтернативное свойство для подзаголовка */
  emptyDescription?: ReactNode
  /** Кастомный компонент при отсутствии элементов */
  emptyState?: ReactNode
  /** Список элементов или компонент под список */
  children?: ReactNode
  /** Компонент под список (если передан отдельным свойством) */
  list?: ReactNode
  /** Дополнительный класс для внешнего контейнера */
  className?: string
  /** Дополнительный класс для контейнера списка */
  listClassName?: string
}

export function CompletedProjects({
  title,
  switchComponent,
  switchSlot,
  isEmpty,
  emptyTitle,
  emptySubtitle,
  emptyDescription,
  emptyState,
  children,
  list,
  className,
  listClassName,
}: CompletedProjectsProps) {
  const switchNode = switchComponent ?? switchSlot
  const content = list ?? children
  const subtitleNode = emptySubtitle ?? emptyDescription
  const isActuallyEmpty = isEmpty ?? (!content || (Array.isArray(content) && content.length === 0))

  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.header}>
        {typeof title === 'string' ? <h3 className={styles.title}>{title}</h3> : title}
        {switchNode && <div className={styles.switchWrapper}>{switchNode}</div>}
      </div>

      <div className={clsx(styles.list, listClassName)}>
        {isActuallyEmpty ? (
          emptyState ?? (
            <div className={styles.description}>
              {emptyTitle && <h5 className={styles.heading}>{emptyTitle}</h5>}
              {subtitleNode && <p className={styles.paragraph}>{subtitleNode}</p>}
            </div>
          )
        ) : (
          content
        )}
      </div>
    </div>
  )
}

export const CompletedProjectsBlock = CompletedProjects
export const ArchivedProjects = CompletedProjects

import { useId, useState, type ReactNode } from 'react'
import clsx from 'clsx'
import styles from './Faq.module.css'
import UpArrowIcon from '@/shared/ui/icons/up_arrow.svg?react'
import DownArrowIcon from '@/shared/ui/icons/down_arrow.svg?react'

export type FaqItem = {
  id?: string
  question: string
  answer: ReactNode
}

export type FaqProps = {
  title?: string
  items: FaqItem[]
  /** Разрешить несколько открытых пунктов одновременно. По умолчанию — аккордеон (один). */
  allowMultiple?: boolean
  /** id пунктов, открытых по умолчанию */
  defaultOpenIds?: string[]
  className?: string
  itemClassName?: string
}

export function Faq({
  items,
  allowMultiple = false,
  defaultOpenIds = [],
  className,
  itemClassName,
  title = 'Ответы на частые вопросы'
}: FaqProps) {
  const reactId = useId()
  const [openIds, setOpenIds] = useState<Set<string>>(
    () => new Set(defaultOpenIds)
  )

  const resolveId = (item: FaqItem, index: number) =>
    item.id ?? `${reactId}-${index}`

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(allowMultiple ? prev : [])
      if (prev.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className={clsx(styles.body, className)}>
      <p>
        {title}
      </p>
      <div className={clsx(styles.root, className)} role="list">
        {items.map((item, index) => {
          const id = resolveId(item, index)
          const isOpen = openIds.has(id)
          const panelId = `${id}-panel`
          const buttonId = `${id}-button`

          return (
            <>
              <div
                key={id}
                className={clsx(styles.item, isOpen && styles.itemOpen, itemClassName)}
                role="listitem"
              >
                <button
                  type="button"
                  id={buttonId}
                  className={styles.trigger}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(id)}
                >
                  <span className={styles.question}>{item.question}</span>
                  <span className={styles.icon} aria-hidden>
                {isOpen ? <UpArrowIcon className={styles.iconInner} /> : <DownArrowIcon className={styles.iconInner} />}
              </span>
                </button>
                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={styles.answer}
                  >
                    {item.answer}
                  </div>
                )}
              </div>
              {
                index < items.length - 1 && <div className={styles.separator} />
              }
            </>
          )
        })}
      </div>
    </div>

  )
}

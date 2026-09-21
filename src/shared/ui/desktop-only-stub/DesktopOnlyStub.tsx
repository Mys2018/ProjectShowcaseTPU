import { useState } from 'react'
import clsx from 'clsx'
import styles from './DesktopOnlyStub.module.css'
import DesktopCheckIcon from '../icons/desktop_check.svg?react'
import {FilledButton, GreyButton} from "@/shared/ui/elements/buttons";

interface DesktopOnlyStubProps {
  title?: string
  description?: string
  className?: string
}

/**
 * Заглушка «страница доступна только с ПК» по макету: монитор с галкой,
 * заголовок, пояснение и пара действий. «Отправить ссылку» копирует адрес в
 * буфер и предлагает системный share, где он доступен, — на десктопе остаётся
 * просто копирование.
 */
export const DesktopOnlyStub = ({
  title = 'Эта страница доступна только с ПК',
  description = 'Она содержит много текстовых полей, таблиц и настроек. Пожалуйста, откройте ее с компьютера.',
  className,
}: DesktopOnlyStubProps) => {
  const [copied, setCopied] = useState(false)

  const sendLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ url: window.location.href })
      } catch {
        // пользователь закрыл системный share — ссылка уже в буфере
      }
    }
  }

  const close = () => {
    window.history.back()
  }

  return (
    <div className={clsx(styles.stub, className)}>
      <DesktopCheckIcon className={styles.icon} />
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      <div className={styles.actions}>
        <GreyButton
          textButton={'Закрыть'}
          onClick={close}
        />
        <FilledButton
          textButton={copied ? 'Ссылка скопирована' : 'Отправить ссылку'}
          onClick={() => void sendLink()}
        />
      </div>
    </div>
  )
}

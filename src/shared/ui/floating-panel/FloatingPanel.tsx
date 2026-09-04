import type { ReactNode } from 'react'
import clsx from 'clsx'
import styles from './FloatingPanel.module.css'
import ShareIcon from '../icons/share.svg?react'
import HeartOutlineIcon from '../icons/heart-outlined.svg?react'
import HeartSolidIcon from '../icons/heart.svg?react'
import ChevronLeftIcon from '../icons/chevron-left.svg?react'
import { ROUTES } from '../../config'
import { useBack } from '../../model/usePageHistory'

interface PanelProps {
  children: ReactNode
  className?: string
  /** Сдвиг вниз из useMobileChrome: панель уезжает синхронно с хедером. */
  transform?: string
  animate?: boolean
  /** Панель полностью за экраном — снимаем клики. */
  hidden?: boolean
}

/** Каркас: круглый слот — центр — круглый слот. Три ребёнка, порядок фиксирован. */
export function FloatingPanel({ children, className, transform, animate, hidden }: PanelProps) {
  return (
    <div
      className={clsx(styles.panel, hidden && styles.hidden, className)}
      style={{ transform, transition: animate ? 'transform .3s ease' : 'none' }}
    >
      {children}
    </div>
  )
}

/* ── Круглые слоты ──────────────────────────────────────────────────── */

interface RoundProps {
  children: ReactNode
  label: string
  onClick?: () => void
  accent?: boolean
}

function Round({ children, label, onClick, accent }: RoundProps) {
  return (
    <button
      type="button"
      className={clsx(styles.round, accent && styles.roundAccent)}
      aria-label={label}
      onClick={onClick}
    >
      <span className={styles.iconBox}>{children}</span>
    </button>
  )
}

/**
 * Подписи здесь нет — в мобильной панели только стрелка. Но переход берётся
 * из того же useBack, что и десктопная ссылка, поэтому «назад» на телефоне
 * и на компьютере ведёт в одно место.
 */
function Back({ onClick, fallback = ROUTES.MAIN }: { onClick?: () => void; fallback?: string }) {
  const { label, go } = useBack(fallback)

  return (
    <button
      type="button"
      className={clsx(styles.round, styles.back)}
      aria-label={label ? `Назад: ${label}` : 'Назад'}
      onClick={onClick ?? go}
    >
      <span className={styles.iconBox}>
        <ChevronLeftIcon />
      </span>
    </button>
  )
}

function Share({ onClick }: { onClick?: () => void }) {
  return (
    <Round label="Поделиться" onClick={onClick}>
      <ShareIcon className={styles.shareIcon} />
    </Round>
  )
}

/**
 * Фон всегда брендовый — так в макете. Состояние различает сама иконка:
 * контурное сердце «не в избранном», залитое — «в избранном».
 */
function Favorite({ active, onClick }: { active?: boolean; onClick?: () => void }) {
  return (
    <Round label={active ? 'Убрать из избранного' : 'В избранное'} onClick={onClick} accent>
      {active ? (
        <HeartSolidIcon className={styles.heartSolid} />
      ) : (
        <HeartOutlineIcon className={styles.heartIcon} />
      )}
    </Round>
  )
}

/* ── Центральная пилюля ─────────────────────────────────────────────── */

interface ActionProps {
  children: ReactNode
  onClick?: () => void
  /** violet и green — цветное кольцо с белой сердцевиной, filled и muted — наоборот. */
  tone?: 'violet' | 'green' | 'filled' | 'muted'
  disabled?: boolean
}

const ACTION_TONE = {
  violet: styles.actionViolet,
  green: styles.actionGreen,
  filled: styles.actionFilled,
  muted: styles.actionMuted
} as const

function Action({ children, onClick, tone, disabled }: ActionProps) {
  return (
    <button
      type="button"
      className={clsx(styles.action, tone && ACTION_TONE[tone])}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={styles.actionInner}>{children}</span>
    </button>
  )
}

interface StatusProps {
  children: ReactNode
  /** Точка слева от подписи; она же задаёт цвет текста. */
  tone?: 'violet' | 'green' | 'gray'
  dot?: boolean
}

function Status({ children, tone = 'gray', dot }: StatusProps) {
  const toneClass =
    tone === 'violet' ? styles.toneViolet : tone === 'green' ? styles.toneGreen : styles.toneGray
  return (
    <div className={styles.status}>
      <span className={clsx(styles.statusInner, toneClass)}>
        {dot && <span className={styles.statusDot} />}
        {children}
      </span>
    </div>
  )
}

interface AppliedProps {
  /** Всегда количество, а не название роли: подпись должна быть одной ширины. */
  count: number
  /** Тап по подписи — податься ещё на одну роль. */
  onOpen?: () => void
  /** Тап по «Отменить» — шторка со списком заявок, где роли снимаются по одной. */
  onCancel?: () => void
}

const rolePlural = (n: number) => (n === 1 ? 'роль' : n % 10 >= 2 && n % 10 <= 4 && (n < 12 || n > 14) ? 'роли' : 'ролей')

function Applied({ count, onOpen, onCancel }: AppliedProps) {
  const label = `${count} ${rolePlural(count)}`
  return (
    <div className={styles.applied}>
      <button
        type="button"
        className={styles.appliedLabel}
        onClick={onOpen}
        title={`Вы откликнулись на ${label}. Нажмите, чтобы податься ещё`}
      >
        {label}
      </button>
      <button type="button" className={styles.appliedCancel} onClick={onCancel}>
        Отменить
      </button>
    </div>
  )
}

interface HintProps {
  title?: string
  text: string
  actionText: string
  onAction: () => void
  onClose: () => void
}

function Hint({ title, text, actionText, onAction, onClose }: HintProps) {
  return (
    <div className={styles.hint} role="dialog" onClick={onClose}>
      {title && <p className={styles.hintTitle}>{title}</p>}
      <p className={styles.hintText}>{text}</p>
      <button type="button" className={styles.hintAction} onClick={onAction}>
        {actionText}
      </button>
    </div>
  )
}

FloatingPanel.Hint = Hint
FloatingPanel.Round = Round
FloatingPanel.Back = Back
FloatingPanel.Share = Share
FloatingPanel.Favorite = Favorite
FloatingPanel.Action = Action
FloatingPanel.Status = Status
FloatingPanel.Applied = Applied

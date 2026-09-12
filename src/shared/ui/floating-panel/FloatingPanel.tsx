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
  /**
   * violet и green — цветное кольцо с белой сердцевиной, filled и muted — наоборот.
   * locked — серое кольцо: кнопка нажимается, но откликнуться уже нельзя.
   */
  tone?: 'violet' | 'green' | 'filled' | 'muted' | 'locked'
  disabled?: boolean
}

const ACTION_TONE = {
  violet: styles.actionViolet,
  green: styles.actionGreen,
  filled: styles.actionFilled,
  muted: styles.actionMuted,
  locked: styles.actionLocked
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

/**
 * Личный статус без действия: «Вы в команде», «Вы уже в другом проекте».
 * Отличается от статуса проекта тем, что зависит от пользователя, а не от проекта,
 * — поэтому и живёт здесь, а не в общем компоненте статусов.
 */
function Note({ children }: { children: ReactNode }) {
  return (
    <div className={styles.note}>
      <span className={styles.noteText}>{children}</span>
    </div>
  )
}

interface AppliedProps {
  /** Левая половина: что со мной уже произошло. */
  children: ReactNode
  /** Правая половина: единственное доступное отсюда действие. */
  actionText: string
  onAction?: () => void
  /**
   * `filled` — серая заливка, действие вторично («Посмотреть»).
   * `outline` — фиолетовая обводка и зелёная подпись, действие поощряется («Выбрать ещё»).
   */
  tone?: 'filled' | 'outline'
}

/** Составной центр: подпись слева, кнопка справа. Высота 56, как у действия. */
function Applied({ children, actionText, onAction, tone = 'filled' }: AppliedProps) {
  return (
    <div className={styles.applied}>
      <span className={styles.appliedLabel}>{children}</span>
      <button
        type="button"
        className={clsx(styles.appliedAction, tone === 'outline' && styles.appliedActionOutline)}
        onClick={onAction}
      >
        {actionText}
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
FloatingPanel.Note = Note
FloatingPanel.Round = Round
FloatingPanel.Back = Back
FloatingPanel.Share = Share
FloatingPanel.Favorite = Favorite
FloatingPanel.Action = Action
FloatingPanel.Applied = Applied

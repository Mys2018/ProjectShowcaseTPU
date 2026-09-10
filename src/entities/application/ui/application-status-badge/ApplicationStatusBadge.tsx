import styles from './ApplicationStatusBadge.module.css'
import type { ApplicationStatus } from '../../model/types'
import clsx from 'clsx'
import { assertNever } from '@/shared'

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus
  className?: string
}

export function ApplicationStatusBadge({ status, className }: ApplicationStatusBadgeProps) {
  switch (status) {
    case 'approved':
      return <p className={clsx(styles.label, styles.approved, className)}>Заявка отклонена</p>
    case 'rejected':
      return <p className={clsx(styles.label, styles.rejected, className)}>Заявка отклонена</p>
    case 'closed':
      return <p className={clsx(styles.label, styles.closed, className)}>Отклик отменён</p>
    case 'pending':
      return (
        <div className={clsx(styles.list, styles.pending, className)}>
          <span className={styles.dot} />
          <p className={styles.label}>На рассмотрении</p>
        </div>
      )
    default:
      return assertNever(status)
  }
}

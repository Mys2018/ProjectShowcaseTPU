import clsx from 'clsx'
import type { ReactElement } from 'react'
import styles from './ProjectIcons.module.css'
import type { ProjectFormat, ProjectStatus } from '../../model/types'
import { FolderIcon, StudyIcon, CodeIcon, assertNever, ClockIcon, CrossIcon, ApproveIcon } from '@/shared'

export function getProjectFormatIcon(format: ProjectFormat): ReactElement {
  switch (format) {
    case 'Case':
      return <FolderIcon />
    case 'Study':
      return <StudyIcon />
    case 'Real':
      return <CodeIcon />
    default:
      return assertNever(format)
  }
}

export function getModerationStatusIcon(status: ProjectStatus): ReactElement {
  switch (status) {
    case 'Pending':
      return <span className={styles.dot} />
    case 'NeedsRework':
      return <ClockIcon className={styles.icon} />
    case 'Rejected':
      return <CrossIcon className={clsx(styles.icon, styles.small)} />
    default:
      return <ApproveIcon className={styles.icon} />
  }
}

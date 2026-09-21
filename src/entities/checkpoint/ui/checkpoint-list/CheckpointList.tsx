import clsx from 'clsx'
import styles from './CheckpointList.module.css'
import type { CheckpointGroup } from '../../model/types'
import { mapDateToLocalString } from '@/shared'

interface CheckpointListProps {
  checkpoints: CheckpointGroup
  className?: string
}

export function CheckpointList({ checkpoints: group, className }: CheckpointListProps) {
  return (
    <div className={clsx(styles.list, className)}>
      {group.checkpoints.map((checkpoint, index) => (
        <div className={styles.checkpoint} key={checkpoint.title}>
          <div className={styles.index}>{index + 1}</div>
          <div className={styles.info}>
            <p className={styles.title}>{checkpoint.title}</p>
            <p className={styles.label}>{mapDateToLocalString(checkpoint.deadline, { digitsOnly: true })}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

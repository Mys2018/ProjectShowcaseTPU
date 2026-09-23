import clsx from 'clsx'
import styles from './ProjectReviewComment.module.css'
import { MessageIcon, Section } from '@/shared'

interface ProjectReviewCommentProps {
  comment: string
  label?: string
  className?: string
}

export function ProjectReviewComment({ comment, label, className }: ProjectReviewCommentProps) {
  return (
    <Section className={clsx(styles.comment, className)}>
      {label && (
        <div className={styles.title}>
          <MessageIcon className={styles.icon} />
          <p className={styles.label}>{label}</p> {/* TODO мок */}
        </div>
      )}
      <p className={styles.label}>{comment}</p>
    </Section>
  )
}

import clsx from 'clsx'
import styles from './ProjectReviewComment.module.css'
import { MessageIcon, Section } from '@/shared'

interface ProjectReviewCommentProps {
  comment: string
  className?: string
}

export function ProjectReviewComment({ comment, className }: ProjectReviewCommentProps) {
  return (
    <Section className={clsx(styles.comment, className)}>
      <div className={styles.title}>
        <MessageIcon className={styles.icon} />
        <p className={styles.label}>Ваш комментарий от 2 сентября</p> {/* TODO мок */}
      </div>
      <p className={styles.label}>{comment}</p>
    </Section>
  )
}

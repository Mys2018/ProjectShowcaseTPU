import clsx from 'clsx'
import styles from './UserGroup.module.css'
import { ImageSkeleton } from '@/shared'

interface UserGroupSkeletonProps {
  className?: string
}

export function UserGroupSkeleton({ className }: UserGroupSkeletonProps) {
  return <div className={clsx(styles.users, className)}>
		{Array.from({length: 4}, (_, i) => <ImageSkeleton key={i} className={styles.avatar} filled />)}
	</div>
}

import s1 from './ImageSkeleton.module.css'
import s2 from '../Skeleton.module.css'
import clsx from 'clsx'

interface ImageSkeletonProps {
  filled?: boolean
  className?: string
}

export function ImageSkeleton({ filled, className }: ImageSkeletonProps) {
  return <div className={clsx(s2.skeleton, filled && s2.filled, s1.image, className)} />
}

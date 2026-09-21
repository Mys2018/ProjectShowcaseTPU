import s1 from './TextSkeleton.module.css'
import s2 from '../Skeleton.module.css'
import clsx from 'clsx'

interface TextSkeletonProps {
  filled?: boolean
  className?: string
  rows?: number
}

export function TextSkeleton({ filled, className, rows = 1 }: TextSkeletonProps) {
  return Array.from({ length: rows }, (_, i) => (
    <div className={clsx(s2.skeleton, filled && s2.filled, s1.text, i + 1 === rows && s1.short, className)} key={i} />
  ))
}

import s1 from './TextSkeleton.module.css'
import s2 from '../Skeleton.module.css'

interface TextSkeletonProps {
  className?: string
  rows?: number
}

export function TextSkeleton({ className, rows = 1 }: TextSkeletonProps) {
  return Array.from({ length: rows }, (_, i) => (
    <div className={`${s2.skeleton} ${s1.text} ${i + 1 === rows ? s1.short : ''} ${className ?? ''}`} key={i} />
  ))
}

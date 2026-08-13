import s1 from './ImageSkeleton.module.css'
import s2 from '../Skeleton.module.css'

interface ImageSkeletonProps {
  className?: string
}

export function ImageSkeleton({ className }: ImageSkeletonProps) {
  return <div className={`${s2.skeleton} ${s1.image} ${className ?? ''}`} />
}

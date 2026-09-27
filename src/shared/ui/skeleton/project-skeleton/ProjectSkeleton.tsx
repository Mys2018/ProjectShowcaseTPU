import s1 from './ProjectSkeleton.module.css'
import s2 from '../Skeleton.module.css'
import clsx from 'clsx'
import type { HTMLAttributes } from 'react'

export interface ProjectSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const ProjectSkeleton = ({ className, style, ...props }: ProjectSkeletonProps) => {
  return (
    <div
      aria-hidden="true"
      className={clsx(s2.skeleton, s1.project, className)}
      style={style}
      {...props}
    />
  )
}

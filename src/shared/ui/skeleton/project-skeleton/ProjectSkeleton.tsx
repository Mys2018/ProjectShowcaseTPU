import s1 from './ProjectSkeleton.module.css'
import s2 from '../Skeleton.module.css'
import clsx from 'clsx'

interface ProjectSkeletonProps {
  className?: string
}

export const ProjectSkeleton = ({className}: ProjectSkeletonProps) => {
  return <div className={clsx(s2.skeleton, s1.project, className)} />
}

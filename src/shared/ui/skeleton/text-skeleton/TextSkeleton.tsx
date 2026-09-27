import s1 from './TextSkeleton.module.css'
import s2 from '../Skeleton.module.css'
import clsx from 'clsx'
import type { CSSProperties, HTMLAttributes } from 'react'

export interface TextSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  filled?: boolean
  className?: string
  rows?: number
  width?: string | number
  height?: string | number
}

export function TextSkeleton({
  filled,
  className,
  rows = 1,
  width,
  height,
  style,
  ...props
}: TextSkeletonProps) {
  const inlineStyle: CSSProperties = {
    ...style,
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
  }

  return Array.from({ length: rows }, (_, i) => (
    <div
      aria-hidden="true"
      className={clsx(s2.skeleton, filled && s2.filled, s1.text, i + 1 === rows && s1.short, className)}
      style={inlineStyle}
      key={i}
      {...props}
    />
  ))
}

import s from './Skeleton.module.css'
import clsx from 'clsx'
import type { CSSProperties, HTMLAttributes } from 'react'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  filled?: boolean
  width?: string | number
  height?: string | number
  borderRadius?: string | number
}

export function Skeleton({
  filled,
  className,
  width,
  height,
  borderRadius,
  style,
  ...props
}: SkeletonProps) {
  const inlineStyle: CSSProperties = {
    ...style,
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
    ...(borderRadius !== undefined ? { borderRadius } : {}),
  }

  return (
    <div
      aria-hidden="true"
      className={clsx(s.skeleton, filled && s.filled, className)}
      style={inlineStyle}
      {...props}
    />
  )
}

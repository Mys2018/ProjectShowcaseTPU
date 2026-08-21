import clsx from 'clsx'
import type { ComponentPropsWithoutRef } from 'react'
import styles from './ProjectCardHeader.module.css'
import { getProjectTagBackground } from '../../lib/tags'

interface ProjectCardHeaderProps extends ComponentPropsWithoutRef<'div'> {
  label: string
  rotated?: boolean
}

export function ProjectCardHeader({ label, rotated, className, children, ...props }: ProjectCardHeaderProps) {
  return (
    <div
      className={clsx(styles.header, rotated && styles.rotated, className)}
      data-bg={label}
      style={{ background: getProjectTagBackground(label) }}
      {...props}
    >
      {children}
    </div>
  )
}

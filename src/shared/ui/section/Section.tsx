import type { ComponentPropsWithoutRef } from 'react'
import styles from './Section.module.css'
import clsx from 'clsx'

export function Section({ className, children, ...props }: ComponentPropsWithoutRef<'div'>) {
	return (
		<div className={clsx(styles.section, className)} {...props}>
			{children}
		</div>
	)
}

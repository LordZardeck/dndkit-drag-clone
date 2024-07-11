import { forwardRef } from 'react'
import classNames from 'classnames'

import styles from './Container.module.css'

export interface Props {
	children: React.ReactNode
	columns?: number
	label?: string
	style?: React.CSSProperties
	horizontal?: boolean
	hover?: boolean
	scrollable?: boolean
	shadow?: boolean
	placeholder?: boolean
	unstyled?: boolean
	onClick?(): void
}

export const Container = forwardRef<HTMLDivElement, Props>(
	(
		{
			children,
			columns = 1,
			horizontal,
			hover,
			onClick,
			label,
			placeholder,
			style,
			scrollable,
			shadow,
			unstyled,
			...props
		}: Props,
		ref,
	) => {
		const Component = onClick ? 'button' : 'div'

		return (
			<Component
				{...props}
				ref={ref}
				style={
					{
						...style,
						'--columns': columns,
					} as React.CSSProperties
				}
				className={classNames(
					styles.Container,
					unstyled && styles.unstyled,
					horizontal && styles.horizontal,
					hover && styles.hover,
					placeholder && styles.placeholder,
					scrollable && styles.scrollable,
					shadow && styles.shadow,
				)}
				onClick={onClick}
				tabIndex={onClick ? 0 : undefined}
			>
				{label ? <div className={styles.Header}>{label}</div> : null}
				{placeholder ? children : <ul>{children}</ul>}
			</Component>
		)
	},
)

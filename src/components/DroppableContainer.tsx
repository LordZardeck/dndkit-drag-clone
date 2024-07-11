import { AnimateLayoutChanges, defaultAnimateLayoutChanges, useSortable } from '@dnd-kit/sortable'
import { Container, ContainerProps } from './Container'
import type { UniqueIdentifier } from '@dnd-kit/core'
import React from 'react'
import { CSS } from '@dnd-kit/utilities'

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
	defaultAnimateLayoutChanges({ ...args, wasDragging: true })

export function DroppableContainer({
	children,
	columns = 1,
	disabled,
	id,
	items,
	style,
	...props
}: ContainerProps & {
	disabled?: boolean
	id: UniqueIdentifier
	items: UniqueIdentifier[]
	style?: React.CSSProperties
}) {
	const { active, isDragging, over, setNodeRef, transition, transform } = useSortable({
		id,
		data: {
			type: 'container',
			children: items,
		},
		animateLayoutChanges,
	})
	const isOverContainer = over
		? (id === over.id && active?.data.current?.type !== 'container') || items.includes(over.id)
		: false

	return (
		<Container
			ref={disabled ? undefined : setNodeRef}
			style={{
				...style,
				transition,
				transform: CSS.Translate.toString(transform),
				opacity: isDragging ? 0.5 : undefined,
			}}
			hover={isOverContainer}
			columns={columns}
			{...props}
		>
			{children}
		</Container>
	)
}

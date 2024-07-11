import type { UniqueIdentifier } from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { Item } from './Item'
import type { Item as ItemType } from './MultipleContainersContext'

export function getColor(id: UniqueIdentifier) {
	switch (String(id)[0]) {
		case 'A':
			return '#7193f1'
		case 'B':
			return '#ffda6c'
		case 'C':
			return '#00bcd4'
		case 'D':
			return '#ef769f'
	}

	return undefined
}

interface SortableItemProps {
	containerId: UniqueIdentifier
	id: UniqueIdentifier
	label: string
	index: number
	handle: boolean
	disabled?: boolean
}

export function SortableItem({
	disabled,
	id,
	label,
	index,
	handle,
	containerId,
}: SortableItemProps) {
	const {
		setNodeRef,
		setActivatorNodeRef,
		listeners,
		isDragging,
		isSorting,
		transform,
		transition,
	} = useSortable({
		id,
		data: {
			container: containerId,
			item: {
				id,
				label,
			} as ItemType,
		},
	})
	const mounted = useMountStatus()
	const mountedWhileDragging = isDragging && !mounted

	return (
		<Item
			ref={disabled ? undefined : setNodeRef}
			value={label}
			dragging={isDragging}
			sorting={isSorting}
			handle={handle}
			handleProps={handle ? { ref: setActivatorNodeRef } : undefined}
			index={index}
			color={getColor(id)}
			transition={transition}
			transform={transform}
			fadeIn={mountedWhileDragging}
			listeners={listeners}
		/>
	)
}

function useMountStatus() {
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		const timeout = setTimeout(() => setIsMounted(true), 500)

		return () => clearTimeout(timeout)
	}, [])

	return isMounted
}

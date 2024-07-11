import { useState } from 'react'
import { Container } from './Container'
import { createRange } from '../utils'
import type { Item as ItemType } from './MultipleContainersContext'
import { getColor, SortableItem } from './SortableItem'
import { type DragOverEvent, type UniqueIdentifier, useDndMonitor } from '@dnd-kit/core'
import { Item } from './Item'

export const SOURCE_ITEMS = createRange<ItemType>(3, (index) => ({
	id: `A${index + 1}`,
	label: `A${index + 1}`,
}))

export function Source() {
	const [isDropping, setIsDropping] = useState<UniqueIdentifier | null>(null)

	useDndMonitor({
		onDragOver(event: DragOverEvent) {
			setIsDropping(event.over?.data.current?.container === 'B' ? event.active.id : null)
		},
		onDragCancel() {
			setIsDropping(null)
		},
		onDragEnd() {
			setIsDropping(null)
		},
	})

	return (
		<Container label='Source'>
			{SOURCE_ITEMS.map((value, index) => {
				if (isDropping === value.id) {
					return (
						<Item
							key={value.id}
							value={value.label}
							dragging={true}
							sorting={false}
							index={index}
							color={getColor(value.id)}
						/>
					)
				}

				return (
					<SortableItem
						key={value.id}
						id={value.id}
						label={value.label}
						index={index}
						handle={false}
						containerId={'A'}
					/>
				)
			})}
		</Container>
	)
}

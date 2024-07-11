import { useState } from 'react'
import { Container } from '../Container'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { SortableItem } from '../SortableItem.tsx'
import type { Item } from '../MultipleContainersContext.tsx'
import { createRange } from '../../utils'
import { useDndMonitor } from '@dnd-kit/core'
import { SOURCE_ITEMS } from '../Source.tsx'
import { nanoid } from 'nanoid'

export function Destination() {
	const [clonedItems, setClonedItems] = useState<Item[] | null>(null)
	const [destinationItems, setDestinationItems] = useState<Item[]>(
		createRange<Item>(3, (index) => ({
			id: nanoid(),
			label: `B${index + 1}`,
		})),
	)

	useDndMonitor({
		onDragStart() {
			setClonedItems(destinationItems)
		},
		onDragOver({ active, over }) {
			const overId = over?.id

			const overContainer = over?.data.current?.container as string | undefined
			const activeContainer = active.data.current?.container as string | undefined

			if (overId == null || destinationItems.find(({ id }) => id === active.id)) {
				return
			}

			if (!overContainer || !activeContainer) {
				return
			}

			// We are moving to a new container and must move the object so that
			// it is rendered in that container's list
			if (activeContainer !== overContainer) {
				setDestinationItems((items) => {
					const overIndex = items.findIndex(({ id }) => id === overId)
					const activeIndex = SOURCE_ITEMS.findIndex(({ id }) => id === active.id)

					let newIndex: number

					if (overId in items) {
						newIndex = items.length + 1
					} else {
						const isBelowOverItem =
							over &&
							active.rect.current.translated &&
							active.rect.current.translated.top > over.rect.top + over.rect.height

						const modifier = isBelowOverItem ? 1 : 0

						newIndex = overIndex >= 0 ? overIndex + modifier : items.length + 1
					}

					return [
						...items.slice(0, newIndex),
						SOURCE_ITEMS[activeIndex],
						...items.slice(newIndex, items.length),
					]
				})
			}
		},
		onDragEnd({ active, over }) {
			const activeContainer = active.data.current?.container as string | undefined

			if (!activeContainer) {
				return
			}

			const overId = over?.id

			if (overId == null) {
				return
			}

			const overContainer = over?.data.current?.container as string | undefined

			if (overContainer === 'A') {
				return
			}

			if (overContainer) {
				setDestinationItems((items) => {
					const overIndex = items.findIndex(({ id }) => id === overId)
					const activeIndex = items.findIndex(({ id }) => id === active.id)

					let nextItems = items

					if (activeIndex !== overIndex) {
						nextItems = arrayMove(items, activeIndex, overIndex)
					}

					if (SOURCE_ITEMS.find(({ id }) => id === active.id)) {
						const lastActiveIndex = nextItems.findIndex(({ id }) => id === active.id)

						console.log('lastActiveIndex', lastActiveIndex)

						nextItems[lastActiveIndex] = {
							id: nanoid(),
							label: `${active.data.current?.item.label}`,
						}
					}

					return nextItems
				})
			}
		},
		onDragCancel() {
			if (clonedItems) {
				// Reset items to their original state in case items have been
				// Dragged across containers
				setDestinationItems(clonedItems)
			}

			setClonedItems(null)
		},
	})

	return (
		<Container label='Destination'>
			<SortableContext
				items={destinationItems.map(({ id }) => id)}
				strategy={verticalListSortingStrategy}
			>
				{destinationItems.map((value, index) => {
					return (
						<SortableItem
							key={value.id}
							id={value.id}
							label={value.label}
							index={index}
							handle={false}
							containerId={'B'}
						/>
					)
				})}
			</SortableContext>
		</Container>
	)
}

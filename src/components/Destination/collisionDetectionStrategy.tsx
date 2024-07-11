import {
	closestCenter,
	CollisionDetection,
	getFirstCollision,
	pointerWithin,
	rectIntersection,
	UniqueIdentifier,
} from '@dnd-kit/core'

export function collisionDetectionStrategy(args: Parameters<CollisionDetection>[0]) {
	const items = args.droppableContainers
		.filter((container) => container.data.current?.container === 'B')
		.map((container) => container.data.current?.item.id as UniqueIdentifier)

	if (args.active.id && items.includes(args.active.id)) {
		return closestCenter({
			...args,
			droppableContainers: args.droppableContainers.filter((container) =>
				items.includes(container.id),
			),
		})
	}

	// Start by finding any intersecting droppable
	const pointerIntersections = pointerWithin(args)
	const intersections =
		pointerIntersections.length > 0
			? // If there are droppables intersecting with the pointer, return those
				pointerIntersections
			: rectIntersection(args)
	let overId = getFirstCollision(intersections, 'id')

	if (overId != null && items.includes(overId)) {
		// If a container is matched, and it contains items (columns 'A', 'B', 'C')
		if (items.length > 0) {
			// Return the closest droppable within that container
			overId = closestCenter({
				...args,
				droppableContainers: args.droppableContainers.filter(
					(container) => container.id !== overId && items.includes(container.id),
				),
			})[0]?.id
		}

		return [{ id: overId }]
	}

	return []
}

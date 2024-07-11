import {
	CollisionDetection,
	DndContext,
	KeyboardSensor,
	MeasuringStrategy,
	MouseSensor,
	TouchSensor,
	UniqueIdentifier,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import { type PropsWithChildren } from 'react'
import { collisionDetectionStrategy as destinationDollisionDetectionStrategy } from './Destination'
import { coordinateGetter } from '../utils'

export type Items = Record<UniqueIdentifier, UniqueIdentifier[]>
export type Item = {
	id: UniqueIdentifier
	label: string
}

export const TRASH_ID = 'void'

/**
 * Custom collision detection strategy optimized for multiple containers
 *
 * - First, find any droppable containers intersecting with the pointer.
 * - If there are none, find intersecting containers with the active draggable.
 * - If there are no intersecting containers, return the last matched intersection
 *
 */
const collisionDetectionStrategy: CollisionDetection = (args) => {
	return [...destinationDollisionDetectionStrategy(args)]
}

export function MultipleContainersContext({ children }: PropsWithChildren<{}>) {
	const sensors = useSensors(
		useSensor(MouseSensor),
		useSensor(TouchSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter,
		}),
	)

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={collisionDetectionStrategy}
			measuring={{
				droppable: {
					strategy: MeasuringStrategy.Always,
				},
			}}
		>
			{children}
		</DndContext>
	)
}

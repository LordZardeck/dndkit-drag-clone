import {
	Destination,
	MultipleContainersContext,
	MultipleContainersOverlay,
	Source,
} from './components'

export default function App() {
	return (
		<MultipleContainersContext>
			<div
				style={{
					display: 'inline-grid',
					boxSizing: 'border-box',
					padding: 20,
					gridAutoFlow: 'column',
				}}
			>
				<Source />
				<Destination />
			</div>
			<MultipleContainersOverlay />
		</MultipleContainersContext>
	)
}

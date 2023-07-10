import { h as _ } from 'preact';

import { createToastComponent } from "components";

const items = [{
	type: 'info',
	title: 'Profile Updated',
	message: 'The updates to your profile were successfully saved',
}, {
	type: 'danger',
	title: 'Failed to post',
	message: 'Your post was unsuccessful, please try again later',
}];

const { Toast } = createToastComponent<typeof items>();

export const Alert = () => {
	return (
		<Toast.Provider options={{
			autoAcknowledgeDelay: 8_000
		}}>
			<>
				<div>
					<Toast.Values>
						{({ itemsAwaitingAcknowledgement }) => (
							<>
								{itemsAwaitingAcknowledgement.map(item => (
									<div>
										<div style={{
											height: 5,
											position: 'relative',
											backgroundColor: 'black',
										}}>
											<div style={{
												top: 0,
												right: 0,
												bottom: 0,
												width: `${item.metadata.progress}%`,
												position: 'absolute',
												backgroundColor: 'white',
												transition: 'width 125ms ease-in-out',
											}}></div>
										</div>
										<button style={{
											color: item.data.type === 'danger' ? 'red' : 'blue'
										}} onClick={item.actions.acknowledge}>{item.data.title}</button>
										<p>{item.data.message}</p>
									</div>
								))}
							</>
						)}
					</Toast.Values>
				</div>
				<Toast.Values>
					{({ add }) => (
						<button onClick={() => add(items)}>Show alerts</button>
					)}
				</Toast.Values>
			</>
		</Toast.Provider>
	)
}
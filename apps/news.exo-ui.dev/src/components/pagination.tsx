import { h as _ } from 'preact';
import { createPaginationComponent } from 'components';

const pages = [{
	name: 'Header one',
	content: 'Description one'
}, {
	name: 'Header two',
	content: 'Description two'
}, {
	name: 'Header three',
	content: 'Description three'
}];

const { Pagination: Control } = createPaginationComponent<typeof pages>();

export const Pagination = () => {
	return (
		<Control.Provider pages={pages} options={{
			onPageChange: (item, index, previous) => console.log({ item, index, previous }),
		}}>
			<>
				<Control.Values>
					{({ activePageIndex }) => (
						<p>{pages[activePageIndex]?.name || 'No page selected.'}</p>
					)}
				</Control.Values>
				<div>
					<Control.Values>
						{({ hydratedSlice, goToPrevPageIndex, goToNextPageIndex, goToLastPageIndex, goToFirstPageIndex }) => (
							<>
								<button onClick={goToFirstPageIndex}>
									Start
								</button>
								<button onClick={goToPrevPageIndex}>
									Back
								</button>
								{hydratedSlice.map(item => (
									<button key={item.metadata.index} onClick={item.actions.select}>
										{item.metadata.page}
									</button>
								))}
								<button onClick={goToNextPageIndex}>
									Forward
								</button>
								<button onClick={goToLastPageIndex}>
									End
								</button>
							</>
						)}
					</Control.Values>
				</div>
			</>
		</Control.Provider>
	)
}

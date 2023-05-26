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
}, {
	name: 'Header four',
	content: 'Description four'
}, {
	name: 'Header five',
	content: 'Description five'
}];

const { Pagination: Control } = createPaginationComponent<typeof pages>();

export const Pagination = () => {
	return (
		<Control.Provider pages={pages} options={{
			onPageChange: (item, index, previous) => console.log({ item, index, previous }),
			sliceBoundary: 1,
		}}>
			<>
				<Control.Values>
					{({ activePageIndex }) => (
						<p>{pages[activePageIndex]?.name}</p>
					)}
				</Control.Values>
				<div>
					<Control.Values>
						{({ hydratedSlice, isExcessPagesLeft, isExcessPagesRight, goToPrevPageIndex, goToNextPageIndex, goToLastPageIndex, goToFirstPageIndex }) => (
							<>
								<button onClick={goToFirstPageIndex}>
									Start
								</button>
								<button onClick={goToPrevPageIndex}>
									Back
								</button>
								{isExcessPagesLeft && (
									<span>...</span>
								)}
								{hydratedSlice.map(item => (
									<button key={item.metadata.index} onClick={item.actions.select} style={{ backgroundColor: item.metadata.isSelected ? 'lime' : 'white'}}>
										{item.metadata.page}
									</button>
								))}
								{isExcessPagesRight && (
									<span>...</span>
								)}
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

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

const { Pagination: Control } = createPaginationComponent();

export const Pagination = () => {
	return (
		<Control.Provider count={pages.length} options={{
			onSelect: (page) => console.log(`onSelect: ${page}`),
			onGoToNextPage: (page) => console.log(`onGoToNextPage: ${page}`),
			onGoToPrevPage: (page) => console.log(`onGoToPrevPage: ${page}`),
			onGoToLastPage: (page) => console.log(`onGoToLastPage: ${page}`),
			onGoToFirstPage: (page) => console.log(`onGoToFirstPage: ${page}`),
			sliceBoundary: 1,
		}}>
			<>
				<Control.Values>
					{({ activePage }) => (
						<p>{pages[activePage - 1]?.name}</p>
					)}
				</Control.Values>
				<div>
					<Control.Values>
						{({ 
							goToNextPage,
							goToPrevPage,
							goToLastPage,
							goToFirstPage,
							hydratedSlice, 
							isExcessPagesLeft,
							isExcessPagesRight,
						}) => (
							<>
								<button onClick={goToFirstPage}>
									Start
								</button>
								<button onClick={goToPrevPage}>
									Back
								</button>
								{isExcessPagesLeft && (
									<span>...</span>
								)}
								{hydratedSlice.map(item => (
									<button key={item.data.page} onClick={item.actions.select} style={{ backgroundColor: item.metadata.isSelected ? 'lime' : 'white'}}>
										{item.data.page}
									</button>
								))}
								{isExcessPagesRight && (
									<span>...</span>
								)}
								<button onClick={goToNextPage}>
									Forward
								</button>
								<button onClick={goToLastPage}>
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

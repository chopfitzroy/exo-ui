import type { ReactNode } from 'react';

import React, { Context, createContext, useContext, useReducer } from 'react';

type SetPageCallback = (page: number) => void;

interface Data {
	page: number;
}

interface Options {
	sliceBoundary: number;
	initialPage: number;
	onSelect?: SetPageCallback;
	onGoToPrevPage?: SetPageCallback;
	onGoToNextPage?: SetPageCallback;
	onGoToLastPage?: SetPageCallback;
	onGoToFirstPage?: SetPageCallback;
}

interface Actions {
	select: () => void;
}

interface Metadata {
	index: number;
	isLast: boolean;
	isFirst: boolean;
	isSelected: boolean;
};

interface AugmentedItem {
	data: Data;
	actions: Actions;
	metadata: Metadata;
}

interface ComputedData {
	activePage: number;
	goToPrevPage: () => void;
	goToNextPage: () => void;
	goToLastPage: () => void;
	goToFirstPage: () => void;
	hydratedItems: AugmentedItem[];
	hydratedSlice: AugmentedItem[];
	showPrevArrow: boolean;
	showNextArrow: boolean;
	isExcessPagesLeft: boolean;
	isExcessPagesRight: boolean;
}

interface ProviderComponentProps {
	count: number;
	children: ReactNode;
	options?: Partial<Options>;
}

interface ValuesComponentProps {
	children: (props: ComputedData) => ReactNode;
}

const defaultOptions = {
	sliceBoundary: 3,
	initialPage: 1,
};

interface SetActivePageParams {
	setter: (current: number) => number;
	callback?: SetPageCallback
}

function createActivePageReducer() {
	return function setActiveSlideReducer(state: number, { setter, callback }: SetActivePageParams) {
		const page = setter(state);

		// @NOTE
		// - Call all user defined callbacks
		if (callback !== undefined) {
			callback(page)
		}

		return page;
	}
}

function createProviderComponent(Context: Context<undefined | ComputedData>) {
	return function MultiSelectListProvider({ count, options, children }: ProviderComponentProps) {
		const optionsWithDefaults: Options = {
			...defaultOptions,
			...options
		}

		const [activePage, setActivePage] = useReducer(
			createActivePageReducer(),
			optionsWithDefaults.initialPage
		);

		const showPrevArrow = activePage !== 1;
		const showNextArrow = activePage !== count;

		const prevPage = Math.max(1, activePage - 1);
		const nextPage = Math.min(count, activePage + 1);

		const leftSiblings = Math.max(0, prevPage - optionsWithDefaults.sliceBoundary);
		const rightSiblings = Math.min(count, activePage + optionsWithDefaults.sliceBoundary);

		const isExcessPagesLeft = leftSiblings > 0;
		const isExcessPagesRight = rightSiblings < count;

		function goToPrevPage() {
			return setActivePage({
				setter: () => prevPage,
				callback: optionsWithDefaults.onGoToPrevPage,
			});
		}

		function goToNextPage() {
			return setActivePage({
				setter: () => nextPage,
				callback: optionsWithDefaults.onGoToNextPage,
			});
		}

		function goToLastPage() {
			return setActivePage({
				setter: () => count,
				callback: optionsWithDefaults.onGoToLastPage,
			});
		}

		function goToFirstPage() {
			return setActivePage({
				setter: () => 1,
				callback: optionsWithDefaults.onGoToFirstPage,
			});
		}

		const hydratedItems = [...Array(count).keys()]
			.map((key) => key + 1)
			.map((page, index, payload) => {
				const isLast = payload.length === index + 1;
				const isFirst = index === 0;
				const isSelected = page === activePage;

				function select() {
					return setActivePage({
						setter: () => page,
						callback: optionsWithDefaults.onSelect
					})
				};

				const data = {
					page,
				}

				const actions = {
					select,
				}

				const metadata = {
					index,
					isLast,
					isFirst,
					isSelected,
				}

				return {
					data,
					actions,
					metadata
				}
			});

		const hydratedSlice = hydratedItems.slice(leftSiblings, rightSiblings);

		const value = {
			activePage,
			goToPrevPage,
			goToNextPage,
			goToLastPage,
			goToFirstPage,
			hydratedItems,
			hydratedSlice,
			showPrevArrow,
			showNextArrow,
			isExcessPagesLeft,
			isExcessPagesRight,
		}

		return <Context.Provider value={value}>{children}</Context.Provider>
	}
}

function createHook(Context: Context<undefined | ComputedData>) {
	return function usePagination() {
		const value = useContext(Context);
		if (value === undefined) {
			throw new Error('usePagination must be used within a PaginationProvider');
		}
		return value;
	}
}

function createValuesComponent(Context: Context<undefined | ComputedData>) {
	const usePagination = createHook(Context);
	return function PaginationValuesComponent({ children }: ValuesComponentProps) {
		const values = usePagination();
		return <>{children(values)}</>
	};
}

export function createPaginationComponent() {
	const Context = createContext<undefined | ComputedData>(undefined);

	return {
		usePagination: createHook(Context),
		Pagination: {
			Provider: createProviderComponent(Context),
			Values: createValuesComponent(Context),
		},
	};
}


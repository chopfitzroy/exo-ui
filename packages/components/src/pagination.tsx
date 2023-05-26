import type { ReactNode } from 'react';

import React, { Context, createContext, useContext, useReducer } from 'react';

type OnPageChangeSignatue<T extends unknown[]> = (item: T[number], index: number, previous: T[number]) => void;

interface Options<T extends unknown[]> {
	sliceBoundary: number;
	initialPageIndex: number;
	onPageChange?: OnPageChangeSignatue<T>
}

interface Actions {
	select: () => void;
}

interface Metadata {
	page: number;
	index: number;
	isSelected: boolean;
};

interface AugmentedItem<T extends unknown[]> {
	data: T[number];
	actions: Actions;
	metadata: Metadata;
}

interface ComputedData<T extends unknown[]> {
	hydratedItems: AugmentedItem<T>[];
	hydratedSlice: AugmentedItem<T>[];
	showPrevArrow: boolean;
	showNextArrow: boolean;
	activePageIndex: number;
	isExcessPagesLeft: boolean;
	isExcessPagesRight: boolean;
	goToPrevPageIndex: () => void;
	goToNextPageIndex: () => void;
	goToLastPageIndex: () => void;
	goToFirstPageIndex: () => void;
}

interface ProviderComponentProps<T extends unknown[]> {
	pages: T;
	children: ReactNode;
	options?: Partial<Options<T>>;
}

interface ValuesComponentProps<T extends unknown[]> {
	children: (props: ComputedData<T>) => ReactNode;
}

const defaultOptions = {
	sliceBoundary: 3,
	initialPageIndex: 0,
};

function createActiveItemReducer<T extends unknown[]>(items: T, callback?: OnPageChangeSignatue<T>) {
	return function activeItemReducer(state: number, index: number) {
		const item = items[index];
		const previous = items[state];

		if (callback === undefined) {
			return index;
		}

		// @NOTE
		// - Handle user provided side effect
		callback(item, index, previous);

		return index;
	}
}

function createProviderComponent<T extends unknown[]>(Context: Context<undefined | ComputedData<T>>) {
	return function MultiSelectListProvider({ pages, options, children }: ProviderComponentProps<T>) {
		const optionsWithDefaults: Options<T> = {
			...defaultOptions,
			...options
		}

		const [activePageIndex, setActivePageIndex] = useReducer(
			createActiveItemReducer<T>(pages, optionsWithDefaults.onPageChange),
			optionsWithDefaults.initialPageIndex
		);

		const showPrevArrow = activePageIndex !== 0;
		const showNextArrow = activePageIndex !== pages.length - 1;

		const prevPageIndex = Math.max(0, activePageIndex - 1);
		const nextPageIndex = Math.min(pages.length - 1, activePageIndex + 1);

		const leftSiblingsIndex = Math.max(0, activePageIndex - optionsWithDefaults.sliceBoundary);

		// @NOTE
		// - Use `nextPageIndex` here to account for the `+1`
		const rightSiblingsIndex = Math.min(pages.length, nextPageIndex + optionsWithDefaults.sliceBoundary);

		const isExcessPagesLeft = leftSiblingsIndex > 0;
		const isExcessPagesRight = rightSiblingsIndex < pages.length;
	
		function goToPrevPageIndex() {
			return setActivePageIndex(prevPageIndex);
		}

		function goToNextPageIndex() {
			return setActivePageIndex(nextPageIndex);
		}

		function goToLastPageIndex() {
			return setActivePageIndex(pages.length - 1);
		}

		function goToFirstPageIndex() {
			return setActivePageIndex(0);
		}

		const hydratedItems = pages.map((data, index) => {
			const page = index + 1;
			const isSelected = index === activePageIndex;

			function select() {
				return setActivePageIndex(index)
			};

			const actions = {
				select
			}

			const metadata = {
				page,
				index,
				isSelected
			}

			return {
				data,
				actions,
				metadata
			}
		});

		const hydratedSlice = hydratedItems.slice(leftSiblingsIndex, rightSiblingsIndex);

		const value = {
			hydratedItems,
			hydratedSlice,
			showPrevArrow,
			showNextArrow,
			activePageIndex,
			isExcessPagesLeft,
			isExcessPagesRight,
			goToPrevPageIndex,
			goToNextPageIndex,
			goToLastPageIndex,
			goToFirstPageIndex
		}

		return <Context.Provider value={value}>{children}</Context.Provider>
	}
}

function createHook<T extends unknown[]>(Context: Context<undefined | ComputedData<T>>) {
	return function usePagination() {
		const value = useContext(Context);
		if (value === undefined) {
			throw new Error('usePagination must be used within a PaginationProvider');
		}
		return value;
	}
}

function createValuesComponent<T extends unknown[]>(Context: Context<undefined | ComputedData<T>>) {
	const usePagination = createHook(Context);
	return function PaginationValuesComponent({ children }: ValuesComponentProps<T>) {
		const values = usePagination();
		return <>{children(values)}</>
	};
}

export function createPaginationComponent<T extends unknown[]>() {
	const Context = createContext<undefined | ComputedData<T>>(undefined);

	return {
		usePagination: createHook(Context),
		Pagination: {
			Provider: createProviderComponent(Context),
			Values: createValuesComponent(Context),
		},
	};
}


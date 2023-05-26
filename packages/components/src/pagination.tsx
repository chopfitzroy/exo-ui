import type { ReactNode } from 'react';

import React, { Context, createContext, useContext, useReducer } from 'react';

type OnPageChangeSignatue = (next: number, previous: number) => void;

interface Options {
	sliceBoundary: number;
	initialPage: number;
	onPageChange?: OnPageChangeSignatue
}

interface Actions {
	select: () => void;
}

interface Metadata {
	isSelected: boolean;
};

interface AugmentedItem {
	data: number;
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

function createActiveItemReducer(callback?: OnPageChangeSignatue) {
	return function activeItemReducer(previous: number, next: number) {
		if (callback === undefined) {
			return next;
		}

		// @NOTE
		// - Handle user provided side effect
		callback(next, previous);

		return next;
	}
}

function createProviderComponent(Context: Context<undefined | ComputedData>) {
	return function MultiSelectListProvider({ count, options, children }: ProviderComponentProps) {
		const optionsWithDefaults: Options = {
			...defaultOptions,
			...options
		}

		const [activePage, setActivePage] = useReducer(
			createActiveItemReducer(optionsWithDefaults.onPageChange),
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
			return setActivePage(prevPage);
		}

		function goToNextPage() {
			return setActivePage(nextPage);
		}

		function goToLastPage() {
			return setActivePage(count);
		}

		function goToFirstPage() {
			return setActivePage(1);
		}

		const hydratedItems = [...Array(count).keys()]
			.map((key) => key + 1)
			.map(data => {
				const isSelected = data === activePage;

				function select() {
					return setActivePage(data)
				};

				const actions = {
					select
				}

				const metadata = {
					isSelected
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


import type { ReactNode } from 'react';

import React, { Context, createContext, useContext, useReducer } from 'react';

type OnPageChangeSignatue<T extends unknown[]> = (item: T[number], index: number, current: T[number]) => void;

interface Options<T extends unknown[]> {
	initialPageIndex: number;
	siblingAllowance: number;
	onPageChange?: OnPageChangeSignatue<T>
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

interface AugmentedItem<T extends unknown[]> {
	data: T[number];
	actions: Actions;
	metadata: Metadata;
}

interface ComputedData<T extends unknown[]> {
	hydratedItems: AugmentedItem<T>[];
	showPrevArrow: boolean;
	showNextArrow: boolean;
	hydratedSiblings: AugmentedItem<T>[];
	goToPrevPageIndex: () => void;
	goToNextPageIndex: () => void;
	goToLastPageIndex: () => void;
	goToFirstPageIndex: () => void;
}

interface ProviderComponentProps<T extends unknown[]> {
	items: T;
	children: ReactNode;
	options?: Partial<Options<T>>;
}

interface ValuesComponentProps<T extends unknown[]> {
	children: (props: ComputedData<T>) => ReactNode;
}

const defaultOptions = {
	initialPageIndex: 0,
	siblingAllowance: 3,
};

function createActiveItemReducer<T extends unknown[]>(items: T, callback?: OnPageChangeSignatue<T>) {
	return function activeItemReducer(state: number, index: number) {
		const item = items[index];
		const current = items[state];

		if (callback === undefined) {
			return index;
		}

		// @NOTE
		// - Handle user provided side effect
		callback(item, index, current);

		return index;
	}
}

function createProviderComponent<T extends unknown[]>(Context: Context<undefined | ComputedData<T>>) {
	return function MultiSelectListProvider({ items, options, children }: ProviderComponentProps<T>) {
		const optionsWithDefaults: Options<T> = {
			...defaultOptions,
			...options
		}

		const [activeItem, setActiveItem] = useReducer(
			createActiveItemReducer<T>(items, optionsWithDefaults.onPageChange),
			optionsWithDefaults.initialPageIndex
		);

		const showPrevArrow = activeItem !== 0;
		const showNextArrow = activeItem !== items.length - 1;

		const prevPageIndex = Math.max(0, activeItem - 1);
		const nextPageIndex = Math.min(items.length - 1, activeItem + 1);

		const leftSiblingsIndex = Math.max(0, activeItem - optionsWithDefaults.siblingAllowance);
		const rightSiblingsIndex = Math.min(items.length - 1, activeItem + defaultOptions.siblingAllowance);

		function goToPrevPageIndex() {
			return setActiveItem(prevPageIndex);
		}

		function goToNextPageIndex() {
			return setActiveItem(nextPageIndex);
		}

		function goToLastPageIndex() {
			return setActiveItem(items.length - 1);
		}

		function goToFirstPageIndex() {
			return setActiveItem(0);
		}

		const hydratedItems = items.map((data, index, payload) => {
			const isLast = payload.length === index + 1;
			const isFirst = index === 0;
			const isSelected = index === activeItem;

			function select() {
				return setActiveItem(index)
			};

			const actions = {
				select
			}

			const metadata = {
				index,
				isLast,
				isFirst,
				isSelected
			}

			return {
				data,
				actions,
				metadata
			}
		});

		const hydratedSiblings = hydratedItems.slice(leftSiblingsIndex, rightSiblingsIndex);

		const value = {
			hydratedItems,
			showPrevArrow,
			showNextArrow,
			hydratedSiblings,
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


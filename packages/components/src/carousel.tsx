import { ReactNode, useCallback, useEffect, useMemo } from 'react';

import React, { Context, createContext, useContext, useReducer } from 'react';

type ActiveSlideCallback<T extends unknown[]> = (item: T[number], index: number, resource: T) => void;

interface Options<T extends unknown[]> {
	autoRotate: boolean;
	rotateDelay: number;
	initiallySelectedSlideIndex: number;
	onNextSlide?: ActiveSlideCallback<T>;
	onPrevSlide?: ActiveSlideCallback<T>;
	onSelectSlide?: ActiveSlideCallback<T>;
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
	next: () => void;
	previous: () => void;
	hydratedItems: AugmentedItem<T>[];
	selectedItem?: AugmentedItem<T>;
}

interface ProviderComponentProps<T extends unknown[]> {
	items: T;
	children: ReactNode;
	options?: Partial<Options<T>>;
}

interface ValuesComponentProps<T extends unknown[]> {
	children: (props: ComputedData<T>) => ReactNode;
}

interface MapComponentProps<T extends unknown[]> {
	children: (props: AugmentedItem<T>) => ReactNode;
}

interface SetActiveSlideParams<T extends unknown[]> {
	setter: (current: number) => number;
	callback?: (ActiveSlideCallback<T>);
}

function createSetActiveSlideReducer<T extends unknown[]>(resource: T) {
	return function setActiveSlideReducer(state: number, { setter, callback }: SetActiveSlideParams<T>) {
		const index = setter(state);

		// @NOTE
		// - Call all user defined callbacks
		if (callback !== undefined) {
			callback(resource[index], index, resource)
		}

		return index;
	}
}

const defaultOptions = {
	autoRotate: true,
	rotateDelay: 3_000,
	initiallySelectedSlideIndex: 0
};

// @NOTE
// - Because this component can invoke a `useEffect`
// - We need to memo more often than we normally would
function createProviderComponent<T extends unknown[]>(Context: Context<undefined | ComputedData<T>>) {
	return function CarouselProvider({ items, options, children }: ProviderComponentProps<T>) {
		const optionsWithDefaults: Options<T> = useMemo(() => ({
			...defaultOptions,
			...options
		}), [options])

		const [activeSlide, setActiveSlide] = useReducer(createSetActiveSlideReducer(items), optionsWithDefaults.initiallySelectedSlideIndex);

		const decrement = useMemo(() => activeSlide - 1, [activeSlide]);
		const increment = useMemo(() => activeSlide + 1, [activeSlide]);

		const next = useCallback(() => {
			return setActiveSlide({
				setter: () => {
					// @NOTE
					// - Loop back round to `0` if at end of list
					return increment >= items.length ? 0 : increment;
				},
				callback: optionsWithDefaults.onNextSlide
			});
		}, [items, increment, optionsWithDefaults]);

		const previous = useCallback(() => {
			return setActiveSlide({
				setter: () => {
					// @NOTE
					// - Loop back round to end of list if at start of list
					return decrement >= 0 ? decrement : items.length - 1;
				},
				callback: optionsWithDefaults.onPrevSlide
			})
		}, [items, decrement, optionsWithDefaults]);

		const hydratedItems = items.map((data, index, resource) => {
			const isLast = resource.length === index + 1;
			const isFirst = index === 0;
			const isSelected = activeSlide === index;

			function select() {
				return setActiveSlide({
					setter: () => index,
					callback: optionsWithDefaults.onSelectSlide,
				});
			};

			const actions = {
				select,
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

		const selectedItem = hydratedItems[activeSlide];

		const value = {
			next,
			previous,
			selectedItem,
			hydratedItems,
		}

		useEffect(() => {
			if (!optionsWithDefaults.autoRotate) {
				return;
			}

			const timer = setTimeout(next, optionsWithDefaults.rotateDelay)

			return () => clearInterval(timer);
		}, [next, optionsWithDefaults]);

		return <Context.Provider value={value}>{children}</Context.Provider>
	}
}

function createHook<T extends unknown[]>(Context: Context<undefined | ComputedData<T>>) {
	return function useCarousel() {
		const value = useContext(Context);
		if (value === undefined) {
			throw new Error('useCarousel must be used within a CarouselProvider');
		}
		return value;
	}
}

function createValuesComponent<T extends unknown[]>(Context: Context<undefined | ComputedData<T>>) {
	const useCarousel = createHook(Context);
	return function CarouselValuesComponent({ children }: ValuesComponentProps<T>) {
		const values = useCarousel();
		return <>{children(values)}</>
	};
}

function createMapComponent<T extends unknown[]>(Context: Context<undefined | ComputedData<T>>) {
	const useCarousel = createHook(Context);
	return function CarouselMapComponent({ children }: MapComponentProps<T>) {
		const { hydratedItems } = useCarousel();
		return <>{hydratedItems.map(item => children(item))}</>;
	};
}

export function createCarouselComponent<T extends unknown[]>() {
	const Context = createContext<undefined | ComputedData<T>>(undefined);

	return {
		useCarousel: createHook(Context),
		Carousel: {
			Provider: createProviderComponent(Context),
			Values: createValuesComponent(Context),
			Map: createMapComponent(Context),
		},
	};
}


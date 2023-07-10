import { ReactNode, useEffect, useMemo } from 'react';

import React, { Context, createContext, useState, useContext } from 'react';

type ActivePageCallback<T extends unknown[]> = (item: T[number]) => void;

interface Options<T extends unknown[]> {
	autoAcknowledge: boolean;
	autoAcknowledgeDelay: number;
	autoAcknowledgeUpdateInterval: number;
	onAcknowledge?: ActivePageCallback<T>;
}

interface Actions {
	acknowledge: () => void;
}

// @NOTE
// - Additional state is added to items during `add`
interface TransientData {
	added: Date;
	progress: number;
	isAcknowledged: boolean;
}

interface Metadata extends TransientData {
	index: number;
	isLast: boolean;
	isFirst: boolean;
};

interface TransientItem<T extends unknown[]> {
	data: T[number];
	metadata: TransientData;
}

interface AugmentedItem<T extends unknown[]> {
	data: T[number];
	actions: Actions;
	metadata: Metadata;
}

interface ComputedData<T extends unknown[]> {
	add: (item: T[number][]) => void;
	hydratedItems: AugmentedItem<T>[];
	itemsAwaitingAcknowledgement: AugmentedItem<T>[];
}

interface ProviderComponentProps<T extends unknown[]> {
	children: ReactNode;
	options?: Partial<Options<T>>;
}

interface ValuesComponentProps<T extends unknown[]> {
	children: (props: ComputedData<T>) => ReactNode;
}

const replace = <T extends unknown[]>(
	payload: TransientItem<T>[],
	...args: [index: number, value: TransientItem<T>][]
) => {
	return args.reduce((result, [index, value]) => {
		return [...result.slice(0, index), value, ...payload.slice(index + 1)];
	}, payload);
};

const update = <T extends unknown[]>(
	payload: TransientItem<T>[],
	index: number,
	value: TransientItem<T>
) => {
	return replace<T>(payload, [index, value]);
};

const defaultOptions = {
	autoAcknowledge: true,
	autoAcknowledgeDelay: 5_000,
	autoAcknowledgeUpdateInterval: 100,
};

function createProviderComponent<T extends unknown[]>(Context: Context<undefined | ComputedData<T>>) {
	return function MultiSelectListProvider({ options, children }: ProviderComponentProps<T>) {
		const optionsWithDefaults = useMemo<Options<T>>(() => ({
			...defaultOptions,
			...options
		}), [options])

		const [toasts, setToasts] = useState<TransientItem<T>[]>([]);

		const add = (items: T[number][]) => {
			const augmented = items.map(item => ({
				data: item,
				metadata: {
					added: new Date(),
					progress: 0,
					isAcknowledged: false,
				}
			}));

			return setToasts(current => [...current, ...augmented]);
		}

		const hydratedItems = useMemo(() => toasts
			.map(({ data, metadata }, index, resource) => {
				const isLast = resource.length === index + 1;
				const isFirst = index === 0;

				function acknowledge() {
					return setToasts(current => {
						// @NOTE
						// - Still debating whether a `useReducer` would make sense to handle this
						if (optionsWithDefaults.onAcknowledge !== undefined) {
							optionsWithDefaults.onAcknowledge(data);
						}

						return update(current, index, {
							data,
							metadata: {
								...metadata,
								progress: 100,
								isAcknowledged: true
							}
						})
					})
				};

				return {
					data,
					actions: {
						acknowledge
					},
					metadata: {
						...metadata,
						index,
						isLast,
						isFirst,
					}
				}
			}), [toasts, optionsWithDefaults]);

		const itemsAwaitingAcknowledgement = useMemo(() => hydratedItems.filter(toast => !toast.metadata.isAcknowledged), [hydratedItems]);

		const value = {
			add,
			hydratedItems,
			itemsAwaitingAcknowledgement,
		}

		useEffect(() => {
			if (!optionsWithDefaults.autoAcknowledge) {
				return;
			}

			const timer = setTimeout(() => {
				// @NOTE
				// - Deliberately using `itemsAwaitingAcknowledgement` here
				// - Would normally use a callback argument with `setToasts`
				// - However given we want this effect to run whenever `toasts` updates
				// - It made more sense to watch this value, also it means we can avoid and extra `filter`
				const filtered = itemsAwaitingAcknowledgement.map(toast => {
					const metadata = toast.metadata;

					const now = new Date();
					const then = metadata.added;
					const diff = now.getTime() - then.getTime();

					const percent = Math.round((diff / optionsWithDefaults.autoAcknowledgeDelay) * 100)
					const progress = Math.min(100, percent);
					const isAcknowledged = progress === 100;

					return {
						...toast,
						metadata: {
							...metadata,
							progress,
							isAcknowledged,
						}
					};
				})
				setToasts(filtered);
			}, optionsWithDefaults.autoAcknowledgeUpdateInterval);

			return () => clearTimeout(timer);
		}, [optionsWithDefaults, itemsAwaitingAcknowledgement]);

		return <Context.Provider value={value}>{children}</Context.Provider>
	}
}

function createHook<T extends unknown[]>(Context: Context<undefined | ComputedData<T>>) {
	return function useToast() {
		const value = useContext(Context);
		if (value === undefined) {
			throw new Error('useToast must be used within a ToastProvider');
		}
		return value;
	}
}

function createValuesComponent<T extends unknown[]>(Context: Context<undefined | ComputedData<T>>) {
	const useToast = createHook(Context);
	return function ToastValuesComponent({ children }: ValuesComponentProps<T>) {
		const values = useToast();
		return <>{children(values)}</>
	};
}

export function createToastComponent<T extends unknown[]>() {
	const Context = createContext<undefined | ComputedData<T>>(undefined);

	return {
		useToast: createHook(Context),
		Toast: {
			Provider: createProviderComponent(Context),
			Values: createValuesComponent(Context),
		},
	};
}


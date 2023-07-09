import { ReactNode, useEffect } from 'react';

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
	add: (item: T[number]) => void;
	hydratedItems: AugmentedItem<T>[];
}

interface ProviderComponentProps<T extends unknown[]> {
	count: number;
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

// @TODO
// - Transition from `unknown[]` to `unknown`
function createProviderComponent<T extends unknown[]>(Context: Context<undefined | ComputedData<T>>) {
	return function MultiSelectListProvider({ options, children }: ProviderComponentProps<T>) {
		const optionsWithDefaults: Options<T> = {
			...defaultOptions,
			...options
		}

		const [toasts, setToasts] = useState<TransientItem<T>[]>([]);

		const add = (item: T[number]) => {
			const augmented = {
				data: item,
				metadata: {
					added: new Date(),
					progress: 0,
					isAcknowledged: false,
				}
			}

			setToasts(current => [...current, augmented]);
		}

		const hydratedItems = toasts
			.map(({ data, metadata }, index, resource) => {
				const isLast = resource.length === index + 1;
				const isFirst = index === 0;

				function acknowledge() {
					return setToasts(current => {
						return update(current, index, {
							data,
							metadata: {
								...metadata,
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
			});

		const value = {
			add,
			hydratedItems,
		}

		// @TODO
		// - Add useEffect to manage timestamp
		useEffect(() => {
			if (!optionsWithDefaults.autoAcknowledge) {
				return;
			}

			const timer = setTimeout(() => {
				setToasts(current => {
					// @TODO
					// - Map over
					// - Update `progress`
					// - Update `isAcknowledged`
					return current;
				})
			}, optionsWithDefaults.autoAcknowledgeUpdateInterval);

			return () => clearTimeout(timer);
			// @TODO
			// - Memo deps...
		}, []);

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


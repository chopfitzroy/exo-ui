// @TODO
// - Create a _tick_ which will check the expiry of each item
// - Update the items progress based on how long it has remaining
// - Remove an item if it has expired

import type { ReactNode } from 'react';

import React, { Context, createContext, useState, useContext } from 'react';

type ActivePageCallback<T extends unknown[]> = (item: T[number]) => void;

interface Options<T extends unknown[]> {
  autoAcknowledge: boolean;
  acknowledgeDelay: number;
  clearAcknowledged: boolean;
  onAcknowledge?: ActivePageCallback<T>;
}

interface Actions {
  acknowledge: () => void;
}

// @NOTE
// - Additional state is added to items during `add`
interface TransientData {
	isAcknowledged: boolean;
  autoAcknowledgeRemaining: number;
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

const defaultOptions = {
  autoAcknowledge: true,
  acknowledgeDelay: 5_000,
  clearAcknowledged: true,
};

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

function createProviderComponent<T extends unknown[]>(Context: Context<undefined | ComputedData<T>>) {
	return function MultiSelectListProvider({ options, children }: ProviderComponentProps<T>) {
		const optionsWithDefaults: Options<T> = {
			...defaultOptions,
			...options
		}

		const [toasts, setToasts] = useState<TransientItem<T>[]>([]);

		const add = (item: T[number]) => {
			if (optionsWithDefaults.onAcknowledge !== undefined) {
				optionsWithDefaults.onAcknowledge(item);
			}

			const augmented = {
				data: item,
				metadata: {
				isAcknowledged: false,
				autoAcknowledgeRemaining: optionsWithDefaults.acknowledgeDelay,
				}
			}

			setToasts(current => [...current, augmented]);
		}

		const hydratedItems = toasts.map(({ data, metadata }) => ({
			data,
			actions: {
				// @TODO
				// - Add actions
				// - Use `update` to set `isAcknowledged` to `true`
			},
			metadata: {
				...metadata,
				// @TODO
				// - Add additional `metadata`
			}
		}))

		const value = {
			add,
			hydratedItems,
		}

		// @TODO
		// - Add useEffect to manage timestamp

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


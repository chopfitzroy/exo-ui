import { ReactNode } from 'react';

import React, { Context, createContext, useContext, useReducer } from 'react';

type ActiveItemCallback<T extends unknown[]> = (item: T[number], index: number, resource: T) => void;

interface Options <T extends unknown[]>{
  initiallySelectedItemIndex: number;
  onSelect?: ActiveItemCallback<T>;
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

interface SetActiveItemParams<T extends unknown[]> {
	setter: (current: number) => number;
	callback?: (ActiveItemCallback<T>);
}

function createSetActiveItemReducer<T extends unknown[]>(resource: T) {
	return function setActiveItemReducer(state: number, { setter, callback }: SetActiveItemParams<T>) {
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
  initiallySelectedItemIndex: -1,
};

function createProviderComponent<T extends unknown[]>(Context: Context<undefined | ComputedData<T>>) {
  return function SingleSelectListProvider({ items, options, children }: ProviderComponentProps<T>) {
    const optionsWithDefaults: Options<T> = {
      ...defaultOptions,
      ...options
    }

    const [activeItem, setActiveItem] = useReducer(createSetActiveItemReducer(items), optionsWithDefaults.initiallySelectedItemIndex);

    const hydratedItems = items.map((data, index, resource) => {
      const isLast = resource.length === index + 1;
      const isFirst = index === 0;
      const isSelected = activeItem === index;

      function select() {
        return setActiveItem({
          setter: (current) => current !== index ? index : -1,
          callback: optionsWithDefaults.onSelect
        });
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

    const selectedItem = activeItem !== undefined ? hydratedItems[activeItem] : undefined;

    const value = {
      selectedItem,
      hydratedItems,
    }

    return <Context.Provider value={value}>{children}</Context.Provider>
  }
}

function createHook<T extends unknown[]>(Context: Context<undefined | ComputedData<T>>) {
  return function useSingleSelectList() {
    const value = useContext(Context);
    if (value === undefined) {
      throw new Error('useSingleSelectList must be used within a SingleSelectListProvider');
    }
    return value;
  }
}

function createValuesComponent<T extends unknown[]>(Context: Context<undefined | ComputedData<T>>) {
  const useSingleSelectList = createHook(Context);
  return function SingleSelectListValuesComponent({ children }: ValuesComponentProps<T>) {
    const values = useSingleSelectList();
    return <>{children(values)}</>
  };
}

function createMapComponent<T extends unknown[]>(Context: Context<undefined | ComputedData<T>>) {
  const useSingleSelectList = createHook(Context);
  return function SingleSelectListMapComponent({ children }: MapComponentProps<T>) {
    const { hydratedItems } = useSingleSelectList();
    return <>{hydratedItems.map(item => children(item))}</>;
  };
}

export function createSingleSelectListComponent<T extends unknown[]>() {
  const Context = createContext<undefined | ComputedData<T>>(undefined);

  return {
    useSingleSelectList: createHook(Context),
    SingleSelectList: {
      Provider: createProviderComponent(Context),
      Values: createValuesComponent(Context),
      Map: createMapComponent(Context),
    },
  };
}


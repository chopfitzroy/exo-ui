import type { ReactNode } from 'react';

import React, { Context, createContext, useContext, useReducer } from 'react';

type ActiveItemsCallback<T extends unknown[]> = (items: T[number][], indices: number[], resource: T) => void;

interface Options <T extends unknown[]>{
  initiallySelectedItemsIndices: number[];
  onSelect?: ActiveItemsCallback<T>
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
  selectedItems: AugmentedItem<T>[];
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

interface SetActiveItemsParams<T extends unknown[]> {
  setter: (current: number[]) => number[];
  callback?: (ActiveItemsCallback<T>);
}

function createSetActiveItemsReducer<T extends unknown[]>(resource: T) {
  return function setActiveItemsReducer(state: number[], { setter, callback }: SetActiveItemsParams<T>) {
    const index = setter(state);

    // @NOTE
    // - Call all user defined callbacks
    if (callback !== undefined) {
      callback(index.map(index => resource[index]), index, resource)
    }

    return index;
  }
}

const defaultOptions = {
  initiallySelectedItemsIndices: [],
}

function createProviderComponent<T extends unknown[]>(Context: Context<undefined | ComputedData<T>>) {
  return function MultiSelectListProvider({ items, options, children }: ProviderComponentProps<T>) {
    const optionsWithDefaults: Options<T> = {
      ...defaultOptions,
      ...options
    }

    const [activeItems, setActiveItems] = useReducer(createSetActiveItemsReducer(items), optionsWithDefaults.initiallySelectedItemsIndices);

    const hydratedItems = items.map((data, index, resource) => {
      const isLast = resource.length === index + 1;
      const isFirst = index === 0;
      const isSelected = activeItems.includes(index);

      function select() {
        return setActiveItems({
          setter: current => {
            const exists = current.includes(index);
            const filtered = current.filter(item => item !== index);
            return exists ? filtered : [...filtered, index];
          },
          callback: optionsWithDefaults.onSelect
        })
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

    const selectedItems = activeItems.map(item => hydratedItems[item]);

    const value = {
      hydratedItems,
      selectedItems
    }

    return <Context.Provider value={value}>{children}</Context.Provider>
  }
}

function createHook<T extends unknown[]>(Context: Context<undefined | ComputedData<T>>) {
  return function useMultiSelectList() {
    const value = useContext(Context);
    if (value === undefined) {
      throw new Error('useMultiSelectList must be used within a MultiSelectListProvider');
    }
    return value;
  }
}

function createValuesComponent<T extends unknown[]>(Context: Context<undefined | ComputedData<T>>) {
  const useMultiSelectList = createHook(Context);
  return function MultiSelectListValuesComponent({ children }: ValuesComponentProps<T>) {
    const { hydratedItems, selectedItems } = useMultiSelectList();
    return <>{children({ hydratedItems, selectedItems })}</>
  };
}

function createMapComponent<T extends unknown[]>(Context: Context<undefined | ComputedData<T>>) {
  const useMultiSelectList = createHook(Context);
  return function MultiSelectListMapComponent({ children }: MapComponentProps<T>) {
    const { hydratedItems } = useMultiSelectList();
    return <>{hydratedItems.map(item => children(item))}</>;
  };
}

export function createMultiSelectListComponent<T extends unknown[]>() {
  const Context = createContext<undefined | ComputedData<T>>(undefined);

  return {
    useMultiSelectList: createHook(Context),
    MultiSelectList: {
      Provider: createProviderComponent(Context),
      Values: createValuesComponent(Context),
      Map: createMapComponent(Context),
    },
  };
}


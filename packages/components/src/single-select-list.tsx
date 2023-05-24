import type { ReactNode } from 'react';

import React, { Context, createContext, useContext, useState } from 'react';

interface Options {
  initiallySelectedItemIndex?: number;
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
  options?: Partial<Options>;
}

interface ValuesComponentProps<T extends unknown[]> {
  children: (props: ComputedData<T>) => ReactNode;
}

interface MapComponentProps<T extends unknown[]> {
  children: (props: AugmentedItem<T>) => ReactNode;
}

const defaultOptions = {};

function createProviderComponent<T extends unknown[]>(Context: Context<undefined | ComputedData<T>>) {
  return function SingleSelectListProvider({ items, options, children }: ProviderComponentProps<T>) {
    const optionsWithDefaults: Options = {
      ...defaultOptions,
      ...options
    }

    const [activeItem, setActiveItem] = useState<number | undefined>(optionsWithDefaults.initiallySelectedItemIndex);

    const hydratedItems = items.map((data, index, payload) => {
      const isLast = payload.length === index + 1;
      const isFirst = index === 0;
      const isSelected = activeItem === index;

      function select() {
        return setActiveItem(index);
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
    const { hydratedItems, selectedItem } = useSingleSelectList();
    return <>{children({ hydratedItems, selectedItem })}</>
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


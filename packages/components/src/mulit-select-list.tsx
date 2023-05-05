import { Context, createContext, ReactNode, useContext } from 'react';

import React from 'react';

import { useState } from 'react';

interface Actions {
  select: () => void;
}

interface Metadata {
  index: number;
  isLast: boolean;
  isFirst: boolean;
  isSelected: boolean;
};

interface AugmentedItem<T extends any[]> {
  data: T[number];
  actions: Actions;
  metadata: Metadata;
}

interface ComputedData<T extends any[]> {
  hydratedItems: AugmentedItem<T>[];
  selectedItems: AugmentedItem<T>[];
}

interface ProviderComponentProps<T extends any[]> {
  items: T;
  children: ReactNode;
}

interface ValuesComponentProps<T extends any[]> {
  children: (props: ComputedData<T>) => ReactNode;
}

interface MapComponentProps<T extends any[]> {
  children: (props: AugmentedItem<T>) => ReactNode;
}

function createProviderComponent<T extends any[]>(Context: Context<undefined | ComputedData<T>>) {
  return function MultiSelectListProvider({ items, children }: ProviderComponentProps<T>) {
    const [activeItems, setActiveItems] = useState<number[]>([]);

    const hydratedItems = items.map((data, index, payload) => {
      const isLast = payload.length === index + 1;
      const isFirst = index === 0;
      const isSelected = activeItems.includes(index);

      function select() {
        return setActiveItems(current => {
          const exists = current.includes(index);
          const filtered = current.filter(item => item !== index);
          return exists ? filtered : [...filtered, index];
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

    const selectedItems = activeItems.map(item => items[item]);

    const value = {
      hydratedItems,
      selectedItems
    }

    return <Context.Provider value={value}>{children}</Context.Provider>
  }

}

function createHook<T extends any[]>(Context: Context<undefined | ComputedData<T>>) {
  return function useMultiSelectList() {
    const value = useContext(Context);

    if (value === undefined) {
      throw new Error('useMultiSelectList must be used within a MultiSelectListProvider');
    }

    return value;
  }
}

function createValuesComponent<T extends any[]>(Context: Context<undefined | ComputedData<T>>) {
  const useMultiSelectList = createHook(Context);

  return function MultiSelectListValuesComponent({ children }: ValuesComponentProps<T>) {
    const { hydratedItems, selectedItems } = useMultiSelectList();

    return <>{children({ hydratedItems, selectedItems })}</>
  };
}


function createMapComponent<T extends any[]>(Context: Context<undefined | ComputedData<T>>) {
  const useMultiSelectList = createHook(Context);

  return function MultiSelectListMapComponent({ children }: MapComponentProps<T>) {
    const { hydratedItems } = useMultiSelectList();

    return <>{hydratedItems.map(item => children(item))}</>;
  };
}



export function createMultiSelectListComponent<T extends any[]>() {
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


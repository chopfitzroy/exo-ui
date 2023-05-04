import { Context, createContext, ReactNode, useContext } from 'react';

import React from 'react';

import { useState } from 'react';

interface Meta {
  index: number;
  active: boolean;
  isLast: boolean;
  isFirst: boolean;
  onClick: () => void;
};

interface AugmentedItem<T extends never[]> {
  item: T[number];
  meta: Meta;
}

interface ComputedData<T extends never[]> {
  hydratedItems: AugmentedItem<T>[];
  selectedItems: AugmentedItem<T>[];
}

interface ComputedDataIterator<T extends never[]> {
  item: T[number],
  meta: Meta;
}

interface ProviderComponentProps<T extends never[]> {
  items: T;
  children: ReactNode;
}

interface ValuesComponentProps<T extends never[]> {
  children: (props: ComputedData<T>) => ReactNode;
}

interface MapComponentProps<T extends never[]> {
  children: (props: ComputedDataIterator<T>) => ReactNode;
}

export function ProivderComponent<T extends never[]>({ items, children }: ProviderComponentProps<T>) {
  const [activeItems, setActiveItems] = useState<number[]>([]);

  const selectedItems = activeItems.map(item => items[item])

  const hydratedItems = items.map((item, index, payload) => {
    const isLast = payload.length === index + 1;
    const isFirst = index === 0;
    const isSelected = activeItems.includes(index);

    const onClick = () => setActiveItems(current => {
      const exists = current.includes(index);
      const filtered = current.filter(item => item !== index);
      return exists ? filtered : [...filtered, index];
    });

    const meta = {
      index,
      isLast,
      isFirst,
      onClick,
      isSelected
    }

    return {
      item,
      meta
    }
  });

  return children;
}

function ValuesComponent<T extends never[]>({ children }: ValuesComponentProps<T>) {

}

function MapComponent<T extends never[]>({ children }: MapComponentProps<T>) {

}

function createHook<T>(context: Context<T>) {
  // @NOTE
  // - Using a named function improves readability
  // - It can also help when debugging
  function useMultiSelectList() {
    const value = useContext(context);

    return value;
  }

  return useMultiSelectList;
}

export function createMultiSelectListComponent<T extends never[]>() {
  const context = createContext<undefined | ComputedData<T>>(undefined);

  // @TODO
  // - This needs to become something like
  // - `createProviderComponent(context)`
  // - `createValuesComponent(context)`
  // - `createMapComponent(context)`

  return [
    {
      Provider: ProivderComponent<T>,
      Values: ValuesComponent<T>,
      Map: MapComponent<T>
    },
    createHook(context)
  ] as const;
}


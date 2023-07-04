import { ReactNode } from 'react';

import React, { Context, createContext, useContext, useReducer } from 'react';

type ActiveItemCallback = (isEnabled: boolean) => void;

interface Options {
  initiallyEnabled: boolean;
  onToggle?: ActiveItemCallback;
  onEnable?: ActiveItemCallback;
  onDisable?: ActiveItemCallback;
}

interface Metadata {
  isEnabled: boolean;
};

interface AugmentedItem<T extends unknown> {
  data: T;
  metadata: Metadata;
}

interface ComputedData<T extends unknown> {
  toggle: () => void;
  enable: () => void;
  disable: () => void;
  hydratedItem: AugmentedItem<T>;
}

interface ProviderComponentProps<T extends unknown> {
  item: T;
  children: ReactNode;
  options?: Partial<Options>;
}

interface ValuesComponentProps<T extends unknown> {
  children: (props: ComputedData<T>) => ReactNode;
}

interface SetActiveItemParams {
	setter: (current: boolean) => boolean;
	callback?: ActiveItemCallback;
}

function createSetActiveItemReducer() {
	return function setActiveItemReducer(state: boolean, { setter, callback }: SetActiveItemParams) {
		const isEnabled = setter(state);

		// @NOTE
		// - Call all user defined callbacks
		if (callback !== undefined) {
			callback(isEnabled)
		}

		return isEnabled;
	}
}

const defaultOptions = {
  initiallyEnabled: false,
};

function createProviderComponent<T extends unknown>(Context: Context<undefined | ComputedData<T>>) {
  return function ToggleProvider({ item: data, options, children }: ProviderComponentProps<T>) {
    const optionsWithDefaults: Options = {
      ...defaultOptions,
      ...options
    }

    const [isEnabled, setIsEnabled] = useReducer(createSetActiveItemReducer(), optionsWithDefaults.initiallyEnabled);

    function toggle() {
      return setIsEnabled({
        setter: (current) => !current,
        callback: optionsWithDefaults.onToggle,
      });
    }

    function enable() {
      return setIsEnabled({
        setter: () => true,
        callback: optionsWithDefaults.onEnable,
      });
    }

    function disable() {
      return setIsEnabled({
        setter: () => false,
        callback: optionsWithDefaults.onDisable,
      });
    }

    const metadata = {
      isEnabled
    }

    const hydratedItem = {
      data,
      metadata
    }

    const value = {
      toggle,
      enable,
      disable,
      hydratedItem,
    }

    return <Context.Provider value={value}>{children}</Context.Provider>
  }
}

function createHook<T extends unknown>(Context: Context<undefined | ComputedData<T>>) {
  return function useToggle() {
    const value = useContext(Context);
    if (value === undefined) {
      throw new Error('useToggle must be used within a ToggleProvider');
    }
    return value;
  }
}

function createValuesComponent<T extends unknown>(Context: Context<undefined | ComputedData<T>>) {
  const useToggle = createHook(Context);
  return function ToggleValuesComponent({ children }: ValuesComponentProps<T>) {
    const values = useToggle();
    return <>{children(values)}</>
  };
}

export function createToggleComponent<T extends unknown>() {
  const Context = createContext<undefined | ComputedData<T>>(undefined);

  return {
    useToggle: createHook(Context),
    Toggle: {
      Provider: createProviderComponent(Context),
      Values: createValuesComponent(Context),
    },
  };
}


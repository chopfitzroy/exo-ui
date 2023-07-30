import type { Dispatch, ReactNode, SetStateAction } from 'react';

import { useState, useContext, createContext } from 'react';
import { createToggleComponent } from '@vistas/exo-ui';

type System = 'metric' | 'imperial';
type ColorScheme = 'auto' | 'dark' | 'light';

interface SettingsModalContextValues {
  system: System;
  setSystem: Dispatch<SetStateAction<System>>;
  colorScheme: ColorScheme;
  setColorScheme: Dispatch<SetStateAction<ColorScheme>>;
}

interface SettingsModalProviderProps {
  children: ReactNode;
}

const modal = {
  title: 'Settings',
  description: 'Updates to settings will take effect immediately',
}

const { Toggle, useToggle } = createToggleComponent<typeof modal>();

const SettingsModalContext = createContext<undefined | SettingsModalContextValues>(undefined)

function SettingsModalProvider({ children }: SettingsModalProviderProps) {
  const [system, setSystem] = useState<System>('metric');
  const [colorScheme, setColorScheme] = useState<ColorScheme>('auto');

  const value = {
    system,
    setSystem,
    colorScheme,
    setColorScheme
  }

  return (
    <Toggle.Provider item={modal}>
      <SettingsModalContext.Provider value={value}>
        {children}
      </SettingsModalContext.Provider>
    </Toggle.Provider>
  )
}

function useSettingsModal() {
  const toggle = useToggle();
  const context = useContext(SettingsModalContext)

  if (context === undefined) {
    throw new Error('useSettingsModal must be used within a SettingsModal.Provider')
  }

  return {
    ...toggle,
    ...context,
  }
}

const SettingsModal = {
  Provider: SettingsModalProvider,
}

function Modal() {
  const {} = useSettingsModal();
  return <p>I am the modal</p>;
}

export default function App() {
  return (
    <SettingsModal.Provider>
      <Modal />
    </SettingsModal.Provider>
  )
}
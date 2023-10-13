import type { ReactNode } from 'react';
import React, { createContext, useContext, useRef, useState } from 'react';
import { LightBoxOverlay } from './light-box-overlay';
import { SharedElementContext } from './light-box.shared';
import { useBackHandlerOnce } from '../../internal/use-back-handler';

export interface LightBoxProviderProps {
  children: ReactNode;
  groupId?: string;
}

export interface LightBoxProviderContext {
  open(index: number): void;

  close(): void;

  visible: boolean;

  _register(item: SharedElementContext): void;

  _inspect(uniqueId: string): SharedElementContext | undefined;

  _update(item: SharedElementContext): void;

  _unregister(item: SharedElementContext): void;
}

const Context = createContext<LightBoxProviderContext>({
  open: () => null,
  close: () => null,
  visible: false,
  _register: () => null,
  _inspect: (uniqueId: string) => undefined,
  _update: () => null,
  _unregister: () => null,
});

export function useLightBoxContext() {
  return useContext(Context);
}

export default function LightBoxProvider(props: LightBoxProviderProps) {
  const sharedElementContext = useRef<SharedElementContext[]>([]);
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const open = (index: number) => {
    setIndex(index);
    setVisible(true);
  };

  const close = () => {
    setVisible(false);
  };

  const register = (lightBoxItem: SharedElementContext) => {
    if (
      sharedElementContext.current.some((i) =>
        SharedElementContext.equals(i, lightBoxItem)
      )
    ) {
      console.warn('[LightBoxProvider] LightBoxItem already registered');
      return;
    }
    sharedElementContext.current.push(lightBoxItem);
  };

  const unregister = (lightBoxItem: SharedElementContext) => {
    const index = sharedElementContext.current.findIndex((i) =>
      SharedElementContext.equals(i, lightBoxItem)
    );
    if (index === -1) {
      console.warn(
        '[LightBoxProvider] LightBoxItem not found, please use LightBox Warp it'
      );
      return;
    }
    sharedElementContext.current.splice(index, 1);
  };

  const updateItem = (newContext: SharedElementContext) => {
    const index = sharedElementContext.current.findIndex((i) =>
      SharedElementContext.equals(i, newContext)
    );
    if (index === -1) {
      console.warn(
        '[LightBoxProvider] LightBoxItem not found, please use LightBox Warp it'
      );
      return;
    }
    sharedElementContext.current[index] = newContext;
  };

  const inspectItem = (uniqueId: string) => {
    const item = sharedElementContext.current.find(
      (i) => i.uniqueId === uniqueId
    );
    if (!item) {
      console.warn(
        '[LightBoxProvider] LightBoxItem not found, please use LightBox Warp it'
      );
      return;
    }
    return item;
  };

  const onOverlayClosed = () => {
    setIndex(-1);
    close();
  };

  useBackHandlerOnce(() => {
    if (visible) {
      close();
      return true;
    }
    return;
  });

  return (
    <Context.Provider
      value={{
        open,
        close,
        visible,
        _register: register,
        _unregister: unregister,
        _update: updateItem,
        _inspect: inspectItem,
      }}
    >
      {props.children}
      <LightBoxOverlay
        visible={visible}
        sharedElement={sharedElementContext.current[index]}
        onDidClose={onOverlayClosed}
      />
    </Context.Provider>
  );
}

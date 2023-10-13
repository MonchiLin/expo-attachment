import { useEffect, useRef } from 'react';
import {
  AppState,
  type AppStateStatus,
  type NativeEventSubscription,
} from 'react-native';

export const onAppShow = (callback: () => void) => {
  const appState = useRef(AppState.currentState);
  const subscription = useRef<NativeEventSubscription | null>(null);

  useEffect(() => {
    subscription.current = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        // Show app if app state is inactive or background
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          callback();
        }

        appState.current = nextAppState;
      }
    );

    return () => {
      subscription.current?.remove();
    };
  }, []);
};

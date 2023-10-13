import { useEffect } from 'react';
import { BackHandler } from 'react-native';

export function useBackHandler(handler: () => boolean | null | undefined) {
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handler);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handler);
    };
  }, [handler]);
}

export function useBackHandlerOnce(handler: () => boolean | null | undefined) {
  useEffect(() => {
    const wrappedHandler = () => {
      const result = handler();
      if (result) {
        BackHandler.removeEventListener('hardwareBackPress', wrappedHandler);
        return true;
      }

      return;
    };

    BackHandler.addEventListener('hardwareBackPress', wrappedHandler);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', wrappedHandler);
    };
  }, [handler]);
}

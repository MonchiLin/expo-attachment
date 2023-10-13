import { useRef, useState } from 'react';

export function useSyncState<T>(initialState: T) {
  const [state, setState] = useState(initialState);
  const ref = useRef(initialState);

  return {
    state,
    setState: (newState: T) => {
      ref.current = newState;
      setState(newState);
    },
    current: () => ref.current,
  };
}

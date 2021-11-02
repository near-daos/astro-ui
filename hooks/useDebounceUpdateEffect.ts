import { useRef, DependencyList } from 'react';
import { useDebounce } from 'react-use';
import { UseDebounceReturn } from 'react-use/lib/useDebounce';

export const useDebounceUpdateEffect = (
  fn: () => void,
  ms?: number,
  deps?: DependencyList
): UseDebounceReturn => {
  const isInitialCall = useRef(true);

  return useDebounce(
    () => {
      if (isInitialCall.current) {
        isInitialCall.current = false;

        return;
      }

      fn?.();
    },
    ms,
    deps
  );
};

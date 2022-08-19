import { useRef, DependencyList } from 'react';
import { useDebounce } from 'react-use';
import { UseDebounceReturn } from 'react-use/lib/useDebounce';

export const useDebounceEffect = <L = DependencyList>(
  fn: (p: {
    isInitialCall: boolean;
    lastCallDeps: L | undefined;
    depsHaveChanged?: boolean;
  }) => void,
  ms?: number,
  deps?: DependencyList
): UseDebounceReturn => {
  const isInitialCall = useRef(true);
  const lastCallDeps = useRef(deps);

  return useDebounce(
    () => {
      const depsHaveChanged = deps?.some(
        (d, i) => lastCallDeps.current?.[i] !== d
      );

      lastCallDeps.current = deps;

      fn?.({
        isInitialCall: isInitialCall.current,
        lastCallDeps: lastCallDeps.current as unknown as L | undefined,
        depsHaveChanged,
      });

      if (isInitialCall.current) {
        isInitialCall.current = false;
      }
    },
    ms,
    deps
  );
};

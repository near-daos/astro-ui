import React from 'react';

export function useSyncRefs<TType>(
  ...refs: (
    | React.MutableRefObject<TType | null>
    | ((instance: TType) => void)
    | null
  )[]
): (val: TType) => void {
  const cache = React.useRef(refs);

  React.useEffect(() => {
    cache.current = refs;
  }, [refs]);

  return React.useCallback(
    (value: TType) => {
      // eslint-disable-next-line no-restricted-syntax
      for (const ref of cache.current) {
        if (ref == null) {
          // eslint-disable-next-line no-continue
          continue;
        }

        if (typeof ref === 'function') {
          ref(value);
        } else {
          ref.current = value;
        }
      }
    },
    [cache]
  );
}

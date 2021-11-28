import { useEffect } from 'react';

export function useWindowResize(callback: () => void, callOnInit = true): void {
  useEffect(() => {
    if (callOnInit) {
      callback();
    }

    window.addEventListener('resize', callback);

    return () => window.removeEventListener('resize', callback);
  }, [callback, callOnInit]);
}

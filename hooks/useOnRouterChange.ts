import { useEffect } from 'react';
import { Router } from 'next/router';

export function useOnRouterChange(callback: () => void): void {
  useEffect(() => {
    Router.events.on('routeChangeComplete', callback);

    return () => Router.events.off('routeChangeComplete', callback);
  }, [callback]);
}

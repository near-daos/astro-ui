import { useCallback, useEffect, useState } from 'react';

export function useAppInitialize(): boolean {
  const [initialized, setInitialized] = useState(false);

  const handleAppConfigReady = useCallback(() => {
    setInitialized(true);
  }, []);

  const handleError = useCallback(e => {
    console.error(
      `Global error: ${e.message}, ${e.source}, ${e.lineno}, ${e.colno}`
    );
    // eslint-disable-next-line
    console.trace(e);

    return true;
  }, []);

  useEffect(() => {
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('error', handleError);
    };
  }, [handleError]);

  useEffect(() => {
    if (window.APP_CONFIG) {
      setInitialized(true);
    }

    document.addEventListener('appConfigReady', handleAppConfigReady);

    return () =>
      document.removeEventListener('appConfigReady', handleAppConfigReady);
  }, [handleAppConfigReady]);

  return initialized;
}

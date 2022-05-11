import { useCallback, useEffect, useState } from 'react';

export function useAppInitialize(): boolean {
  const [initialized, setInitialized] = useState(false);

  const handleAppConfigReady = useCallback(() => {
    setInitialized(true);
  }, []);

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

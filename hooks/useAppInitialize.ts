import { useCallback, useEffect, useState } from 'react';

// We can safely ignore this as it is expected behavior for some scenarios
// see https://github.com/WICG/resize-observer/issues/38
const SAFELY_IGNORE_ERRORS = ['ResizeObserver loop limit exceeded'];

// Following warnings in console are comes from wallet selector modal-ui and we cannot control it right now
// Anyway they are just warnings and do not affect any functionality
// so we can temp hide them until next version of selector mal will be released
const consoleError = console.error;
const SUPPRESSED_WARNINGS = [
  'You are calling ReactDOMClient.createRoot()',
  'Render methods should be a pure function of props and state',
];

console.error = function filterWarnings(msg, ...args) {
  try {
    if (
      !SUPPRESSED_WARNINGS.some(entry =>
        msg?.includes ? msg?.includes(entry) : true
      )
    ) {
      consoleError(msg, ...args);
    }
  } catch (e) {
    consoleError(msg, ...args);
  }
};

export function useAppInitialize(): boolean {
  const [initialized, setInitialized] = useState(false);

  const handleAppConfigReady = useCallback(() => {
    setInitialized(true);
  }, []);

  const handleError = useCallback((e: ErrorEvent) => {
    if (SAFELY_IGNORE_ERRORS.includes(e?.message)) {
      return false;
    }

    console.error(
      `Global error: ${e.message}, ${e.filename}, ${e.lineno}, ${e.colno}`
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

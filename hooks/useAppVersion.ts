import { useFlags } from 'launchdarkly-react-client-sdk';
import { useCookie } from 'react-use';
import { useCallback } from 'react';
import { CookieService } from 'services/CookieService';

export function getAppVersion(): number {
  try {
    const appVersion = CookieService.get('astroAppVersion');

    return appVersion ? Number(appVersion) : 2;
  } catch (e) {
    return 2;
  }
}

export function useAppVersion(): {
  appVersionEnabled: boolean;
  appVersion: number | null;
  updateAppVersion: (val: string) => void;
} {
  const { applicationVersionSelect, defaultApplicationUiVersion } = useFlags();
  const [value, updateCookie] = useCookie('astroAppVersion');

  const updateAppVersion = useCallback(
    (val: string) => {
      updateCookie(val, { path: '/' });
    },
    [updateCookie]
  );

  return {
    appVersionEnabled: applicationVersionSelect,
    appVersion:
      (value ? Number(value) : null) || defaultApplicationUiVersion || null,
    updateAppVersion,
  };
}

import { useEffect, useState } from 'react';
import axios from 'axios';

import { Config, NearConfig } from 'types/config';
import { getNearConfig, NEAR_ENV } from 'config/near';

export function useAppConfig(): {
  appConfig: Config | null;
  nearConfig: NearConfig | null;
} {
  const [appConfig, setAppConfig] = useState<Config | null>(null);
  const [nearConfig, setNearConfig] = useState<NearConfig | null>(null);

  useEffect(() => {
    const { CancelToken } = axios;
    const source = CancelToken.source();

    axios
      .get<Config>('/api/config', { cancelToken: source.token })
      .then(({ data }) => {
        const appNearConfig = getNearConfig(
          (data.NEAR_ENV || 'development') as NEAR_ENV
        );

        setAppConfig(data);
        setNearConfig(appNearConfig);
      });

    return () => {
      source.cancel('Cancelled on unmount');
    };
  }, []);

  return { appConfig, nearConfig };
}

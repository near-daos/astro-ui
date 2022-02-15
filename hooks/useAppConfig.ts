import { useEffect, useState } from 'react';
import axios from 'axios';

import { Config } from 'types/config';

export function useAppConfig(): Config | null {
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    const { CancelToken } = axios;
    const source = CancelToken.source();

    axios
      .get('/api/config', { cancelToken: source.token })
      .then(({ data }) => setConfig((data as unknown) as Config));

    return () => {
      source.cancel('Cancelled on unmount');
    };
  }, []);

  return config;
}

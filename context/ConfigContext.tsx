import { createContext, FC, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Config } from 'types/config';

interface ConfigContextInterface {
  config: Config | null;
}

const ConfigContext = createContext<ConfigContextInterface>({
  config: null,
});

export const ConfigContextProvider: FC = ({ children }) => {
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

  return (
    <ConfigContext.Provider value={{ config }}>
      {children}
    </ConfigContext.Provider>
  );
};

export function useConfigContext(): ConfigContextInterface {
  const context = useContext(ConfigContext);

  return context;
}

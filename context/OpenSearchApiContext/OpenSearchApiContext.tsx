import { OpenSearchApiService } from 'services/SearchService';
import { createContext, FC, useContext, useMemo } from 'react';

interface IOpenSearchApiContext {
  service: OpenSearchApiService | null;
}

export const OpenSearchApiContext = createContext<IOpenSearchApiContext>({
  service: null,
});

export const useOpenSearchApi = (): IOpenSearchApiContext => {
  const context = useContext(OpenSearchApiContext);

  if (context === undefined) {
    throw new Error(
      'useOpenSearchApi was used outside of OpenSearchApiContext'
    );
  }

  return context;
};

export const OpenSearchApiProvider: FC = ({ children }) => {
  const value = useMemo(() => {
    return {
      service: new OpenSearchApiService(),
    };
  }, []);

  return (
    <OpenSearchApiContext.Provider value={value}>
      {children}
    </OpenSearchApiContext.Provider>
  );
};

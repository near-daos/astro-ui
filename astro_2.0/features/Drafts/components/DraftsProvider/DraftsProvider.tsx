import { DraftsService } from 'services/DraftsService';
import { createContext, FC, useContext, useEffect, useState } from 'react';
import { HttpService } from 'services/HttpService';
import { appConfig } from 'config';

interface IDraftsContext {
  draftsService: DraftsService;
}

const DraftsContext = createContext<IDraftsContext>({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  draftsService: undefined,
});

export const useDraftsContext = (): IDraftsContext => useContext(DraftsContext);

export const DraftsDataProvider: FC = ({ children }) => {
  const [draftsService, setDraftsService] = useState<
    DraftsService | undefined
  >();

  useEffect(() => {
    setTimeout(() => {
      const httpService = new HttpService({
        baseURL: `${
          process.browser
            ? window.APP_CONFIG.STATS_API_URL
            : appConfig.STATS_API_URL
        }/api/v1/`,
      });

      const statsService = new DraftsService(httpService);

      setDraftsService(statsService);
    }, 500);
  }, []);

  if (!draftsService) {
    return null;
  }

  return (
    <DraftsContext.Provider value={{ draftsService }}>
      {children}
    </DraftsContext.Provider>
  );
};

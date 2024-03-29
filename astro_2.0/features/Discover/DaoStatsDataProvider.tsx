import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { HttpService } from 'services/HttpService';
import { appConfig } from 'config';
import { DaoStatsService } from 'services/DaoStatsService';

interface IDaoStatsContext {
  daoStatsService: DaoStatsService;
}

const DaoStatsContext = createContext<IDaoStatsContext>({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  daoStatsService: undefined,
});

export const useDaoStatsContext = (): IDaoStatsContext =>
  useContext(DaoStatsContext);

export const DaoStatsDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const [daoStatsService, setDaoStatsService] = useState<
    DaoStatsService | undefined
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

      const statsService = new DaoStatsService(httpService);

      setDaoStatsService(statsService);
    }, 1000);
  }, []);

  const contextValue = useMemo(() => {
    return { daoStatsService: daoStatsService as DaoStatsService };
  }, [daoStatsService]);

  if (!daoStatsService) {
    return null;
  }

  return (
    <DaoStatsContext.Provider value={contextValue}>
      {children}
    </DaoStatsContext.Provider>
  );
};

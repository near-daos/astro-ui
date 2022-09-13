import { createContext, FC, useContext, useMemo } from 'react';

import { useDaoSettingsData } from 'context/DaoSettingsContext/hooks';
import { Settings } from 'types/settings';

import useQuery from 'hooks/useQuery';

interface IDaoSettingContext {
  loading: boolean;
  update: (updates: Record<string, unknown>) => Promise<void>;
  settings: Settings | null | undefined;
}

export const DaoSettingsContext = createContext<IDaoSettingContext | undefined>(
  undefined
);

export const useDaoSettings = (): IDaoSettingContext => {
  const context = useContext(DaoSettingsContext);

  if (context === undefined) {
    throw new Error(
      'useDaoSettings was used outside of its DaoSettingsContext provider'
    );
  }

  return context;
};

export const DaoSettingsProvider: FC = ({ children }) => {
  const {
    query: { dao: daoId },
  } = useQuery<{ dao: string }>();

  const { settings, update, loading } = useDaoSettingsData(daoId);

  const contextValue = useMemo(() => {
    return {
      settings,
      update,
      loading,
    };
  }, [loading, settings, update]);

  return (
    <DaoSettingsContext.Provider value={contextValue}>
      {children}
    </DaoSettingsContext.Provider>
  );
};

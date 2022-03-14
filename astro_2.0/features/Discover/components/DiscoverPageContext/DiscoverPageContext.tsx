import { createContext, FC, useContext, useMemo, useState } from 'react';
import { DOMAIN_RANGES } from 'components/AreaChartRenderer/helpers';
import { Range } from 'components/AreaChartRenderer/types';

interface IDiscoverPageContext {
  setRange: (val: Range) => void;
  range: Range;
}

/* eslint-disable @typescript-eslint/no-empty-function */
export const DiscoverPageContext = createContext<IDiscoverPageContext>({
  setRange: () => {},
  range: DOMAIN_RANGES.ALL,
});
/* eslint-enable @typescript-eslint/no-empty-function */

export const DiscoverPageProvider: FC = ({ children }) => {
  const [range, setRange] = useState(DOMAIN_RANGES.ALL);

  const contextValue = useMemo(
    () => ({
      range,
      setRange,
    }),
    [range]
  );

  return (
    <DiscoverPageContext.Provider value={contextValue}>
      {children}
    </DiscoverPageContext.Provider>
  );
};

export const useDiscoverPageRange = (): IDiscoverPageContext =>
  useContext(DiscoverPageContext);

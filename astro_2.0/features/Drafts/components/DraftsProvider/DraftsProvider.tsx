import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useToggle } from 'react-use';

import { DraftsService } from 'services/DraftsService';

import { useDraftService } from 'hooks/useDraftService';

interface IDraftsContext {
  draftsService: DraftsService;
  toggleWriteComment: boolean;
  setToggleWriteComment: (toggle?: boolean) => void;
  amountComments: number;
  setAmountComments: (amount: number) => void;
}

const DraftsContext = createContext<IDraftsContext>({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  draftsService: undefined,
  toggleWriteComment: false,
  setToggleWriteComment: () => undefined,
  amountComments: 0,
  setAmountComments: () => undefined,
});

export const useDraftsContext = (): IDraftsContext => useContext(DraftsContext);

export const DraftsDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const [amountComments, setAmountComments] = useState(0);
  const [toggleWriteComment, setToggleWriteComment] = useToggle(false);
  const draftsService = useDraftService();

  const contextValue = useMemo(
    () => ({
      draftsService: draftsService as DraftsService,
      toggleWriteComment,
      setToggleWriteComment,
      setAmountComments,
      amountComments,
    }),
    [amountComments, draftsService, setToggleWriteComment, toggleWriteComment]
  );

  if (!draftsService) {
    return null;
  }

  return (
    <DraftsContext.Provider value={contextValue}>
      {children}
    </DraftsContext.Provider>
  );
};

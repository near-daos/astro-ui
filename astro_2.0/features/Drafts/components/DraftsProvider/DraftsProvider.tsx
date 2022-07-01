import { DraftsService } from 'services/DraftsService';
import { createContext, FC, useContext, useEffect, useState } from 'react';
import { HttpService } from 'services/HttpService';
import { appConfig } from 'config';
import { useToggle } from 'react-use';

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

export const DraftsDataProvider: FC = ({ children }) => {
  const [draftsService, setDraftsService] = useState<
    DraftsService | undefined
  >();
  const [amountComments, setAmountComments] = useState(0);
  const [toggleWriteComment, setToggleWriteComment] = useToggle(false);

  useEffect(() => {
    setTimeout(() => {
      const httpService = new HttpService({
        baseURL: `${
          process.browser
            ? window.APP_CONFIG.DRAFTS_API_URL
            : appConfig.DRAFTS_API_URL
        }/api/v1/`,
      });

      setDraftsService(new DraftsService(httpService));
    }, 500);
  }, []);

  if (!draftsService) {
    return null;
  }

  return (
    <DraftsContext.Provider
      value={{
        draftsService,
        toggleWriteComment,
        setToggleWriteComment,
        setAmountComments,
        amountComments,
      }}
    >
      {children}
    </DraftsContext.Provider>
  );
};

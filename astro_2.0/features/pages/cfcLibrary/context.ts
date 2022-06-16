import { createContext, useContext } from 'react';
import { DaoFeedItem } from 'types/dao';

interface Props {
  accountDaos: DaoFeedItem[];
  accountId: string;
  onUpdate: (templateId: string, daosCount: number) => void;
}

export const CfcLibraryContext = createContext<Props>({
  accountDaos: [],
  accountId: '',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onUpdate: () => {},
});

export const useCfcValues = (): Props => useContext<Props>(CfcLibraryContext);

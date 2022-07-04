import { createContext, useContext } from 'react';

interface DelegatePageContext {
  daoName: string;
  stakedBalance?: string;
  delegatedBalance?: number;
  triggerUpdate?: () => void;
  contractAddress?: string;
  nextActionTime?: Date;
}

export const DelegatePageContext = createContext<DelegatePageContext>({
  daoName: '',
  stakedBalance: undefined,
  delegatedBalance: undefined,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  triggerUpdate: () => {},
  contractAddress: '',
  nextActionTime: new Date(),
});

export const useDelegatePageContext = (): DelegatePageContext =>
  useContext(DelegatePageContext);

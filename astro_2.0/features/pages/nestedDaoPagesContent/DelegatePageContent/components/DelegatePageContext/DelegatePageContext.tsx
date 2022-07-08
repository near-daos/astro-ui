import { createContext, useContext } from 'react';

interface DelegatePageContext {
  daoName: string;
  stakedBalance?: string;
  delegatedBalance?: number;
  triggerUpdate?: () => void;
  contractAddress?: string;
  nextActionTime?: Date;
  memberBalance: string;
  delegateToUser?: Record<string, string>;
}

export const DelegatePageContext = createContext<DelegatePageContext>({
  daoName: '',
  stakedBalance: undefined,
  delegatedBalance: undefined,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  triggerUpdate: () => {},
  contractAddress: '',
  nextActionTime: new Date(),
  memberBalance: '0',
  delegateToUser: {},
});

export const useDelegatePageContext = (): DelegatePageContext =>
  useContext(DelegatePageContext);

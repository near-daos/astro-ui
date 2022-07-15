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
  decimals?: number;
  symbol?: string;
  votingGoal: number;
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
  decimals: 0,
  symbol: '',
  votingGoal: 0,
});

export const useDelegatePageContext = (): DelegatePageContext =>
  useContext(DelegatePageContext);

import React, { useContext } from 'react';

import { WizardFlow } from './types';

export type TData = {
  tokenName?: string;
  tokenSymbol?: string;
  totalSupplyOfToken: number;
  tokenIcon: string | ArrayBuffer | null;
  targetAccount: string;
};

type TWizardContext = {
  data?: TData;
  handleSetSteps: (selectedFlow: WizardFlow) => void;
  handleNext: (d?: Partial<TData>) => void;
  handleSubmit: (d?: Partial<TData>) => void;
  handleBack: () => void;
  handleCancel: () => void;
  activeFlow: WizardFlow;
};

export const WizardContext = React.createContext<TWizardContext>(
  {} as TWizardContext
);

export const useWizardContext = (): TWizardContext =>
  useContext<TWizardContext>(WizardContext);

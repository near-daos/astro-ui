import { createContext, useContext } from 'react';

interface ICompareProposalContext {
  view: 'prev' | 'current' | null;
}

/* eslint-disable @typescript-eslint/no-empty-function */
export const CompareProposalContext = createContext<ICompareProposalContext>({
  view: null,
});
/* eslint-enable @typescript-eslint/no-empty-function */

export function useCompareProposalContext(): ICompareProposalContext {
  return useContext(CompareProposalContext);
}

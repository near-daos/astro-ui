import { Bounty } from 'types/bounties';
import { ReactNode } from 'react';
import { ProposalVariant } from 'types/proposal';

export type SectionItem = {
  id: string;
  title: string;
  proposer: string;
  proposalId: string;
  bounty?: Bounty;
  completeHandler?: (
    id: number,
    variant: ProposalVariant.ProposeDoneBounty
  ) => void;
  content: ReactNode;
};

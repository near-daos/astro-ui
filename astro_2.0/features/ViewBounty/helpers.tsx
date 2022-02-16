import { CardContent } from 'astro_2.0/features/ViewBounty/components/CardContent';
import { Bounty, BountyProposal } from 'types/bounties';
import React, { ReactNode } from 'react';
import { nanosToDays } from 'astro_2.0/features/DaoGovernance/helper';
import { AddBountyContent } from 'astro_2.0/features/ViewProposal/components/AddBountyContent';
import { ProposalType } from 'types/proposal';

export function getContentNode(
  bounty?: Bounty,
  proposal?: BountyProposal
): ReactNode {
  if (!bounty && proposal) {
    if (proposal.kind.type === ProposalType.AddBounty) {
      const bountyData = proposal.kind.bounty;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const deadline = nanosToDays(bountyData.maxDeadline);

      return (
        <AddBountyContent
          slots={bountyData.times}
          deadlineThreshold={deadline.join(' ')}
          token={bountyData.token}
          amount={bountyData.amount}
        />
      );
    }
  }

  if (bounty) {
    return <CardContent amount={bounty.amount} token={bounty.token} />;
  }

  return null;
}

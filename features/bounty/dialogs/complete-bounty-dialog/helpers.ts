import { CreateProposalParams } from 'types/proposal';

import { EXTERNAL_LINK_SEPARATOR } from 'constants/common';

export function getCompleteBountyProposal(
  daoId: string,
  details: string,
  externalUrl: string,
  target: string,
  bond: string,
  bountyId?: string
): CreateProposalParams {
  const proposalDescription = `${details}${EXTERNAL_LINK_SEPARATOR}${externalUrl}`;

  return {
    daoId,
    description: proposalDescription,
    kind: 'BountyDone',
    data: {
      receiver_id: target,
      bounty_id: Number(bountyId),
    },
    bond,
  };
}

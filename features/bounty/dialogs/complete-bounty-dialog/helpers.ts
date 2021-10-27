import { CreateProposalParams } from 'types/proposal';
import { CompleteBountyFormInput } from 'features/bounty/dialogs/complete-bounty-dialog/complete-bounty-form/CompleteBountyForm';
import { EXTERNAL_LINK_SEPARATOR } from 'constants/common';

export function getCompleteBountyProposal(
  daoId: string,
  bountyId: string,
  data: CompleteBountyFormInput,
  bond: string
): CreateProposalParams {
  const proposalDescription = `${data.details}${EXTERNAL_LINK_SEPARATOR}${data.externalUrl}`;

  return {
    daoId,
    description: proposalDescription,
    kind: 'BountyDone',
    data: {
      receiver_id: data.recipient,
      bounty_id: Number(bountyId),
    },
    bond,
  };
}

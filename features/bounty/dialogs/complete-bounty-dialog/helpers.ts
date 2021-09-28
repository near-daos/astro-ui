import { CreateProposalParams } from 'types/proposal';
import { CompleteBountyFormInput } from 'features/bounty/dialogs/complete-bounty-dialog/complete-bounty-form/CompleteBountyForm';

export function getCompleteBountyProposal(
  daoId: string,
  bountyId: string,
  data: CompleteBountyFormInput,
  bond: string
): CreateProposalParams {
  return {
    daoId,
    description: data.details,
    kind: 'BountyDone',
    data: {
      receiver_id: data.recipient,
      bounty_id: Number(bountyId)
    },
    bond
  };
}

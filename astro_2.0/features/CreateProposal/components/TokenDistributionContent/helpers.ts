import { DAO } from 'types/dao';
import { TokenDistributionInput } from 'astro_2.0/features/CreateProposal/types';
import { CreateProposalParams } from 'types/proposal';

export function getInputWidth(currentValue?: string): string {
  if (!currentValue) {
    return '4ch';
  }

  if (currentValue?.length > 4 && currentValue?.length <= 8) {
    return `${currentValue?.length}ch`;
  }

  if (currentValue?.length > 8) {
    return '8ch';
  }

  return '4ch';
}

export function getTokenDistributionProposal(
  dao: DAO,
  data: TokenDistributionInput
): CreateProposalParams {
  return {
    daoId: dao.id,
    description: `token distribution ${data.groups.length}`,
    kind: 'Vote',
    bond: dao.policy.proposalBond,
  };
}

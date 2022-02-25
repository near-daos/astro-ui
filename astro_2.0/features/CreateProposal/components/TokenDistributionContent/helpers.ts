import { DAO } from 'types/dao';
import { TokenDistributionInput } from 'astro_2.0/features/CreateProposal/types';
import { CreateProposalParams } from 'types/proposal';

export function getInputWidth(
  currentValue?: string,
  maxWidth?: number
): string {
  const max = maxWidth || 8;

  if (!currentValue) {
    return '4ch';
  }

  if (currentValue?.length > 4 && currentValue?.length <= max) {
    return `${currentValue?.length}ch`;
  }

  if (currentValue?.length > max) {
    return `${max}ch`;
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

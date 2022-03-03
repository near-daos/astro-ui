import { DAO } from 'types/dao';
import { TokenDistributionInput } from 'astro_2.0/features/CreateProposal/types';
import { CreateProposalParams } from 'types/proposal';

export function getInputWidth(
  currentValue?: string,
  maxWidth?: number,
  minWidth?: number
): string {
  const max = maxWidth || 8;
  const min = minWidth || 4;

  if (!currentValue) {
    return `${min}ch`;
  }

  if (currentValue?.length > min && currentValue?.length <= max) {
    return `${currentValue?.length}ch`;
  }

  if (currentValue?.length > max) {
    return `${max}ch`;
  }

  return `${min}ch`;
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

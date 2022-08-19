import { TFunction } from 'next-i18next';
import min from 'lodash/min';
import max from 'lodash/max';
import { DAO, DaoDelegation } from 'types/dao';

export function getSortOptions(
  t: TFunction
): { label: string; value: string }[] {
  return [
    {
      label: t('ascending'),
      value: 'ASC',
    },
    {
      label: t('descending'),
      value: 'DESC',
    },
  ];
}

export function getVotingGoal(
  votingThreshold: number,
  totalSupply: number,
  quorum: number
): number {
  const target = min([votingThreshold, totalSupply]);

  const goal = max([target, quorum]);

  return goal ?? 0;
}

export function getActiveTokenHolders(
  delegations: DaoDelegation[],
  balance: string
): DaoDelegation[] {
  return delegations.filter(
    item => Number(item.balance ?? 0) >= Number(balance)
  );
}

export function getTokensVotingPolicyDetails(dao?: DAO): {
  balance: string;
  threshold: string;
  quorum: string;
} {
  const holdersRole = dao?.policy.roles.find(
    role => role.kind === 'Member' && role.name === 'TokenHolders'
  );

  if (!holdersRole) {
    return {
      balance: '0',
      threshold: '0',
      quorum: '0',
    };
  }

  return {
    threshold: holdersRole.votePolicy.vote.weight ?? '0',
    balance: holdersRole.balance ?? '0',
    quorum: holdersRole.votePolicy.vote.quorum ?? '0',
  };
}

import { TFunction } from 'next-i18next';
import min from 'lodash/min';
import max from 'lodash/max';

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

import Decimal from 'decimal.js';

import { CreateProposalParams } from 'types/proposal';
import { DeadlineUnit } from 'components/cards/bounty-card/types';

import { CreateBountyInput } from './types';

export function getDeadline(timeAmount: number, unit: DeadlineUnit): string {
  const nanosecondsInDay = new Decimal('8.64e+13');
  let multiplier = timeAmount;

  if (unit === 'week') {
    multiplier *= 7;
  } else if (unit === 'month') {
    multiplier *= 30;
  }

  return nanosecondsInDay.mul(multiplier).toString();
}

export function getAddBountyProposal(
  daoId: string,
  data: CreateBountyInput
): CreateProposalParams {
  const { slots, amount, details, deadlineUnit, deadlineThreshold } = data;

  const proposalDescription = `${details}`;

  return {
    daoId,
    description: proposalDescription,
    kind: 'AddBounty',
    data: {
      bounty: {
        description: proposalDescription,
        token: '',
        amount: amount.toString(),
        times: slots,
        max_deadline: getDeadline(deadlineThreshold, deadlineUnit)
      }
    },
    bond: '1000000000000000000000000'
  };
}

import Decimal from 'decimal.js';
import { yoktoNear } from 'services/SputnikService';
import { CreateProposalParams } from 'types/proposal';
import { DAO } from 'types/dao';
import { DeadlineUnit } from 'components/cards/bounty-card/types';
import { EXTERNAL_LINK_SEPARATOR } from 'constants/common';

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
  data: CreateBountyInput,
  dao: DAO
): CreateProposalParams {
  const {
    slots,
    amount,
    details,
    deadlineUnit,
    deadlineThreshold,
    externalUrl
  } = data;

  const proposalDescription = `${details}${EXTERNAL_LINK_SEPARATOR}${externalUrl}`;

  return {
    daoId,
    description: proposalDescription,
    kind: 'AddBounty',
    data: {
      bounty: {
        description: proposalDescription,
        token: '',
        amount: new Decimal(amount).mul(yoktoNear).toFixed(),
        times: slots,
        max_deadline: getDeadline(deadlineThreshold, deadlineUnit)
      }
    },
    bond: dao.policy.proposalBond
  };
}

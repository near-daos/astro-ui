import Decimal from 'decimal.js';

import { FUNGIBLE_TOKEN } from 'features/types';
import { YOKTO_NEAR } from 'services/sputnik/constants';
import { EXTERNAL_LINK_SEPARATOR } from 'constants/common';

import { DAO } from 'types/dao';
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
  data: CreateBountyInput,
  dao: DAO
): CreateProposalParams {
  const {
    slots,
    amount,
    details,
    deadlineUnit,
    deadlineThreshold,
    externalUrl,
    tokenAddress,
    token
  } = data;

  const proposalDescription = `${details}${EXTERNAL_LINK_SEPARATOR}${externalUrl}`;

  return {
    daoId,
    description: proposalDescription,
    kind: 'AddBounty',
    data: {
      bounty: {
        description: proposalDescription,
        token: token === FUNGIBLE_TOKEN && tokenAddress ? tokenAddress : '',
        amount: new Decimal(amount).mul(YOKTO_NEAR).toFixed(),
        times: slots,
        max_deadline: getDeadline(deadlineThreshold, deadlineUnit)
      }
    },
    bond: dao.policy.proposalBond
  };
}

import Decimal from 'decimal.js';

import { EXTERNAL_LINK_SEPARATOR } from 'constants/common';

import { DAO } from 'types/dao';
import { CreateProposalParams } from 'types/proposal';

import { DeadlineUnit } from 'components/cards/bounty-card/types';

import { Tokens } from 'context/CustomTokensContext';
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
  dao: DAO,
  data: CreateBountyInput,
  tokens: Tokens
): CreateProposalParams {
  const {
    slots,
    amount,
    details,
    deadlineUnit,
    deadlineThreshold,
    externalUrl,
    token,
  } = data;

  const proposalDescription = `${details}${EXTERNAL_LINK_SEPARATOR}${externalUrl}`;
  const tokenDecimal = 10 ** tokens[token].decimals;
  const { tokenId } = tokens[token];

  return {
    daoId: dao.id,
    description: proposalDescription,
    kind: 'AddBounty',
    data: {
      bounty: {
        description: proposalDescription,
        token: tokenId,
        amount: new Decimal(amount).mul(tokenDecimal).toFixed(),
        times: slots,
        max_deadline: getDeadline(deadlineThreshold, deadlineUnit),
      },
    },
    bond: dao.policy.proposalBond,
  };
}

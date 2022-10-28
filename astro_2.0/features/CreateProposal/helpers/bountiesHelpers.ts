import Decimal from 'decimal.js';

// Types
import {
  CreateBountyInput,
  BondsAndDeadlinesData,
} from 'astro_2.0/features/CreateProposal/types';
import { DAO } from 'types/dao';
import { CreateProposalParams } from 'types/proposal';
import { Tokens } from 'types/token';

import { DATA_SEPARATOR } from 'constants/common';

// Helpers & Utils
import { keysToSnakeCase } from 'utils/keysToSnakeCase';
import { dataRoleToContractRole } from 'features/groups/helpers';

import { YOKTO_NEAR } from 'services/sputnik/constants';
import { DeadlineUnit } from 'types/bounties';

export function getCompleteBountyProposal(
  daoId: string,
  details: string,
  externalUrl: string,
  target: string,
  bond: string,
  bountyId?: number
): CreateProposalParams {
  const proposalDescription = `${details}${DATA_SEPARATOR}${externalUrl}`;

  return {
    daoId,
    description: proposalDescription,
    kind: 'BountyDone',
    data: {
      receiver_id: target,
      bounty_id: Number(bountyId),
    },
    bond,
  };
}

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
  let tokenData = Object.values(tokens).find(item => item.tokenId === token);

  if (!tokenData) {
    tokenData = Object.values(tokens).find(item => item.symbol === token);
  }

  if (!tokenData) {
    throw new Error('No tokens data found');
  }

  const proposalDescription = `${details}${DATA_SEPARATOR}${externalUrl}`;
  const { tokenId, decimals } = tokenData;
  const tokenDecimal = 10 ** decimals;

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

export function getChangeBondDeadlinesProposal(
  dao: DAO,
  {
    createProposalBond,
    proposalExpireTime,
    claimBountyBond,
    unclaimBountyTime,
  }: BondsAndDeadlinesData,
  initialValues: {
    accountName: string;
    createProposalBond: number;
    proposalExpireTime: number;
    claimBountyBond: number;
    unclaimBountyTime: number;
  },
  proposalBond: string,
  description: string
): CreateProposalParams {
  const { id, policy } = dao;

  const { defaultVotePolicy } = policy;

  const { ratio, quorum, weightKind } = defaultVotePolicy;

  return {
    daoId: id,
    description,
    kind: 'ChangePolicy',
    data: {
      policy: {
        roles: dao.policy.roles.map(daoRole => dataRoleToContractRole(daoRole)),
        default_vote_policy: keysToSnakeCase({
          quorum,
          threshold: ratio,
          weightKind,
        }),
        proposal_bond: new Decimal(createProposalBond)
          .mul(YOKTO_NEAR)
          .toFixed(),
        proposal_period: new Decimal(proposalExpireTime)
          .mul('3.6e12')
          .toFixed(),
        bounty_bond: new Decimal(claimBountyBond).mul(YOKTO_NEAR).toFixed(),
        bounty_forgiveness_period: new Decimal(unclaimBountyTime)
          .mul('3.6e12')
          .toFixed(),
      },
    },
    bond: proposalBond,
  };
}

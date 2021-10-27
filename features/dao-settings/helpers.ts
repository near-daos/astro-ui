import Decimal from 'decimal.js';
import { NextRouter } from 'next/router';

import {
  DaoConfig,
  ConfigChangeReason,
  CreateProposalParams,
} from 'types/proposal';
import { DAO } from 'types/dao';

import { SINGLE_DAO_PAGE } from 'constants/routing';
import { keysToSnakeCase } from 'utils/keysToSnakeCase';
import { YOKTO_NEAR } from 'services/sputnik/constants';
import { dataRoleToContractRole } from 'features/groups/helpers';

export interface NameAndPurposeData {
  purpose: string;
  displayName: string;
}

export function getChangeConfigProposal(
  daoId: string,
  { name, purpose, metadata }: DaoConfig,
  reason: ConfigChangeReason,
  proposalBond: string
): CreateProposalParams {
  return {
    kind: 'ChangeConfig',
    daoId,
    data: {
      config: {
        metadata,
        name,
        purpose,
      },
    },
    description: `${reason} for ${daoId}`,
    bond: proposalBond,
  };
}

export interface BondsAndDeadlinesData {
  createProposalBond: number;
  proposalExpireTime: number;
  claimBountyBond: number;
  unclaimBountyTime: number;
  details: string;
  externalUrl: string;
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
  proposalBond: string
): CreateProposalParams {
  const { id, policy } = dao;

  const { defaultVotePolicy } = policy;

  const { ratio, quorum, weightKind } = defaultVotePolicy;

  const generateDescription = () => {
    const description = [];

    if (createProposalBond !== initialValues.createProposalBond) {
      description.push(`new proposal bond is ${createProposalBond}`);
    }

    if (proposalExpireTime !== initialValues.proposalExpireTime) {
      description.push(`new proposal expire time is ${proposalExpireTime}`);
    }

    if (claimBountyBond !== initialValues.claimBountyBond) {
      description.push(`new bounty claim bond: ${claimBountyBond}`);
    }

    if (unclaimBountyTime !== initialValues.unclaimBountyTime) {
      description.push(`new bounty forgiveness period: ${unclaimBountyTime}`);
    }

    return description.join(', ');
  };

  return {
    daoId: id,
    description: generateDescription(),
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

export function navigateToDaoPage(router: NextRouter): void {
  const {
    push,
    query: { dao },
  } = router;

  push({
    pathname: SINGLE_DAO_PAGE,
    query: {
      dao,
    },
  });
}

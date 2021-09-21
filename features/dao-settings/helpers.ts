import Decimal from 'decimal.js';
import { yoktoNear } from 'services/SputnikService';
import { DAO } from 'types/dao';
import { CreateProposalParams } from 'types/proposal';
import { dataRoleToContractRole } from 'features/groups/helpers';
import { keysToSnakeCase } from 'utils/keysToSnakeCase';

export interface NameAndPurposeData {
  name: string;
  purpose: string;
  details: string;
  externalUrl: string;
}

export function getChangeConfigProposal(
  daoId: string,
  { name, purpose, externalUrl, details }: NameAndPurposeData
): CreateProposalParams {
  const proposalDescription = `${details}, ${externalUrl}`;

  return {
    kind: 'ChangeConfig',
    daoId,
    data: {
      config: {
        metadata: '',
        name,
        purpose
      }
    },
    description: proposalDescription,
    bond: '1000000000000000000000000'
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
    details,
    externalUrl
  }: BondsAndDeadlinesData
): CreateProposalParams {
  const { id, policy } = dao;

  const { defaultVotePolicy } = policy;

  const { ratio, quorum, weightKind } = defaultVotePolicy;

  return {
    daoId: id,
    description: `${details} ${externalUrl}`,
    kind: 'ChangePolicy',
    data: {
      policy: {
        roles: dao.policy.roles.map(daoRole => dataRoleToContractRole(daoRole)),
        default_vote_policy: keysToSnakeCase({
          quorum,
          threshold: ratio,
          weightKind
        }),
        proposal_bond: new Decimal(createProposalBond).mul(yoktoNear).toFixed(),
        proposal_period: new Decimal(proposalExpireTime)
          .mul('3.6e12')
          .toFixed(),
        bounty_bond: new Decimal(claimBountyBond).mul(yoktoNear).toFixed(),
        bounty_forgiveness_period: new Decimal(unclaimBountyTime)
          .mul('3.6e12')
          .toFixed()
      }
    },
    bond: '1000000000000000000000000'
  };
}

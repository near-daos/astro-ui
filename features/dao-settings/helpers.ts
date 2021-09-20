import Decimal from 'decimal.js';
import { yoktoNear } from 'services/SputnikService';
import { DAO } from 'types/dao';
import { CreateProposalParams } from 'types/proposal';

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
  const { id } = dao;

  return {
    daoId: id,
    description: `${details} ${externalUrl}`,
    kind: 'ChangePolicy',
    data: {
      policy: {
        ...dao.policy,
        proposal_bond: new Decimal(createProposalBond)
          .mul(yoktoNear)
          .toNumber(),
        proposal_period: new Decimal(proposalExpireTime)
          .mul(yoktoNear)
          .toNumber(),
        bounty_bond: new Decimal(claimBountyBond).mul(yoktoNear).toNumber(),
        bounty_forgiveness_period: new Decimal(unclaimBountyTime)
          .mul(yoktoNear)
          .toNumber()
      }
    },
    bond: '1000000000000000000000000'
  };
}

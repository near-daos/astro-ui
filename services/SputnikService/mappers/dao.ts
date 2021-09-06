import get from 'lodash.get';

import { DAO } from 'types/dao';

import { yoktoNear } from 'services/SputnikService/constants';
import Decimal from 'decimal.js';

export type DaoPermission =
  | '*:Finalize'
  | '*:AddProposal'
  | '*:VoteApprove'
  | '*:VoteReject'
  | '*:VoteRemove';

export type DaoRole = {
  kind: 'Everyone' | { group: string[] };
  name: string;
  permissions: DaoPermission[];
  votePolicy: unknown;
};

export type DaoVotePolicy = {
  quorum: string;
  threshold: number[];
  weightKind: 'RoleWeight';
};

export type DaoPolicy = {
  bountyBond: string;
  bountyForgivenessPeriod: string;
  createdAt: string;
  daoId: string;
  defaultVotePolicy: DaoVotePolicy;
  proposalBond: string;
  proposalPeriod: string;
  roles: DaoRole[];
};

export type DaoDTO = {
  amount: string;
  createTimestamp: string;
  createdAt: string;
  description: string | null;
  id: string;
  lastBountyId: number;
  lastProposalId: number;
  link: string | null;
  metadata: string;
  name: string;
  policy: DaoPolicy;
  purpose: string;
  stakingContract: string;
  status: 'Success';
  totalSupply: string;
  transactionHash: string;
  updateTimestamp: string;
};

export const mapDaoDTOtoDao = (daoDTO: DaoDTO): DAO => {
  // Calculate DAO members count
  const roles = get(daoDTO, 'policy.roles', []);
  const councilRole = roles.find((item: DaoRole) => item.name === 'council');
  const numberOfMembers = get(councilRole, 'kind.group', []).length;

  // Transform amount
  const amountYokto = new Decimal(daoDTO.amount);
  const funds = amountYokto.div(yoktoNear).toFixed(2);

  // Get DAO groups
  const daoGroups = roles
    .filter((item: DaoRole) => item.kind !== 'Everyone')
    .map((item: DaoRole) => {
      return {
        members: (item.kind as { group: string[] }).group,
        name: item.name,
        permissions: item.permissions,
        votePolicy: item.votePolicy,
        slug: item.name
      };
    });

  return {
    id: daoDTO.id,
    name: daoDTO.name,
    description: daoDTO.purpose,
    members: numberOfMembers,
    proposals: 18,
    // TODO - where can we get DAO logo flag?
    logo: 'https://i.imgur.com/t5onQz9.png',
    funds,
    createdAt: daoDTO.createdAt,
    groups: daoGroups
  };
};

export const mapDaoDTOListToDaoList = (daoList: DaoDTO[]): DAO[] => {
  return daoList.map(daoItem => {
    return mapDaoDTOtoDao(daoItem);
  });
};

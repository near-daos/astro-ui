import get from 'lodash/get';

import { DAO } from 'types/dao';
import { DaoRole } from 'types/role';
import { formatYoktoValue } from 'helpers/format';
import { awsConfig } from 'config';

export type DaoVotePolicy = {
  weightKind: string;
  quorum: string;
  kind: string;
  ratio: number[];
};

export type DaoPolicy = {
  createdAt: string;
  daoId: string;
  proposalBond: string;
  bountyBond: string;
  proposalPeriod: string;
  bountyForgivenessPeriod: string;
  defaultVotePolicy: DaoVotePolicy;
  roles: DaoRole[];
};

type DaoConfig = {
  name: string;
  purpose: string;
  metadata: string;
};

export interface GetDAOsResponse {
  data: DaoDTO[];
}

export type DaoDTO = {
  createdAt: string;
  transactionHash: string;
  updateTransactionHash: string;
  createTimestamp: string;
  updateTimestamp: string;
  id: string;
  config: DaoConfig;
  amount: string;
  totalSupply: string;
  lastBountyId: number;
  lastProposalId: number;
  numberOfProposals: number;
  stakingContract: string;
  numberOfMembers: number;
  council: string[];
  councilSeats: number;
  link: unknown | null;
  description: string | null;
  status: 'Success';
  policy: DaoPolicy;
};

export type DaoMetadata = {
  links: string[];
  flag: string;
};

export const fromMetadataToBase64 = (metadata: DaoMetadata): string => {
  return Buffer.from(JSON.stringify(metadata)).toString('base64');
};

export const fromBase64ToMetadata = (metaAsBase64: string): DaoMetadata => {
  return JSON.parse(Buffer.from(metaAsBase64, 'base64').toString('ascii'));
};

export const mapDaoDTOtoDao = (daoDTO: DaoDTO): DAO => {
  const roles = get(daoDTO, 'policy.roles', []);
  const numberOfMembers = get(daoDTO, 'numberOfMembers', 0);
  const numberOfProposals = get(daoDTO, 'lastProposalId', 0);

  // Transform amount
  const funds = formatYoktoValue(daoDTO.amount);

  // Get DAO groups
  const daoGroups = roles
    .filter((item: DaoRole) => item.kind === 'Group')
    .map((item: DaoRole) => {
      return {
        members: item.accountIds,
        name: item.name,
        permissions: item.permissions,
        votePolicy: item.votePolicy,
        slug: item.name
      };
    });

  const config = get(daoDTO, 'config');

  const meta = config.metadata ? fromBase64ToMetadata(config.metadata) : null;

  const getLogoUrl = (flag: string) =>
    `https://${awsConfig.bucket}.s3.${awsConfig.region}.amazonaws.com/${flag}`;

  return {
    id: daoDTO.id,
    name: config?.name ?? '',
    description: config?.purpose ?? '',
    members: numberOfMembers,
    proposals: numberOfProposals,
    logo: meta ? getLogoUrl(meta.flag) : getLogoUrl(daoDTO.id),
    funds,
    createdAt: daoDTO.createdAt,
    groups: daoGroups,
    policy: daoDTO.policy,
    links: meta && meta.links ? meta.links : []
  };
};

export const mapDaoDTOListToDaoList = (daoList: DaoDTO[]): DAO[] => {
  return daoList.map(daoItem => {
    return mapDaoDTOtoDao(daoItem);
  });
};

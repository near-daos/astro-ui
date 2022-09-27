import get from 'lodash/get';
import Decimal from 'decimal.js';

import {
  DAO,
  DaoFeedItem,
  DaoSubscription,
  RolesRequest,
  VotePolicyRequest,
} from 'types/dao';
import { DaoRole } from 'types/role';
import { CreateDaoParams } from 'services/sputnik/types';
import { YOKTO_NEAR } from 'services/sputnik/constants';

import { jsonToBase64Str } from 'utils/jsonToBase64Str';
import { fromBase64ToObj } from 'utils/fromBase64ToObj';

import { DaoPolicy } from 'services/sputnik/types/policy';

import { getAwsImageUrl } from './utils/getAwsImageUrl';

type DaoConfig = {
  name: string;
  purpose: string;
  metadata: string;
};

export interface GetDAOsResponse {
  data: DaoFeedItemResponse[];
  total: number;
}

export type DaoFeedItemResponse = {
  createdAt: string;
  id: string;
  config: DaoConfig;
  numberOfMembers: number;
  numberOfGroups: number;
  accountIds: string[];
  activeProposalCount: number;
  totalProposalCount: number;
  totalDaoFunds: number;
  transactionHash: string;
  council: string[];
  isCouncil: boolean;
  policy: {
    daoId: string;
    roles: {
      name: string;
      accountIds: string[];
    }[];
  };
};

export type DaoDTO = {
  createdAt: string;
  daoVersionHash: string;
  daoVersion: {
    createdAt: string;
    hash: string;
    version: number[];
    commitId: string;
    changelogUrl: string;
  };
  transactionHash: string;
  updateTimestamp: string;
  id: string;
  config: DaoConfig;
  lastProposalId: number;
  policy: DaoPolicy;
  activeProposalCount: number;
  totalProposalCount: number;
  totalDaoFunds: number;
  stakingContract: string;
};

export type DaoMetadata = {
  links: string[];
  flagCover?: string;
  flagLogo?: string;
  flag?: string;
  displayName: string;
  legal?: {
    legalStatus?: string;
    legalLink?: string;
  };
};

export type MemberStats = {
  accountId: string;
  voteCount: number;
};

export type DaoSubscriptionDTO = { id: string; dao: DaoDTO };

export const fromBase64ToMetadata = (metaAsBase64: string): DaoMetadata => {
  return fromBase64ToObj(metaAsBase64);
};

export const mapDaoDTOtoDao = (daoDTO: DaoDTO): DAO | null => {
  if (!daoDTO.id) {
    return null;
  }

  const roles = get(daoDTO, 'policy.roles', []);
  const numberOfProposals = get(daoDTO, 'totalProposalCount', 0);

  // Get DAO groups
  const daoGroups = roles
    .filter((item: DaoRole) => item.kind === 'Group')
    .map((item: DaoRole) => {
      return {
        members: item.accountIds,
        name: item.name,
        permissions: item.permissions,
        votePolicy: item.votePolicy,
        slug: item.name,
      };
    });

  const config = get(daoDTO, 'config');

  const meta = config?.metadata ? fromBase64ToMetadata(config.metadata) : null;

  const daoMembersList = daoGroups
    .map(({ members }: { members: string[] }) => members)
    .flat()
    .reduce((acc: string[], member: string) => {
      if (!acc.includes(member)) {
        acc.push(member);
      }

      return acc;
    }, []);
  const numberOfMembers = daoMembersList.length;

  return {
    id: daoDTO.id,
    txHash: daoDTO.transactionHash ?? '',
    daoVersionHash: daoDTO.daoVersionHash,
    daoVersion: daoDTO.daoVersion,
    name: config?.name ?? '',
    description: config?.purpose ?? '',
    members: numberOfMembers,
    daoMembersList,
    activeProposalsCount: daoDTO.activeProposalCount ?? 0,
    totalProposalsCount: daoDTO.totalProposalCount ?? 0,
    totalProposals: numberOfProposals,
    logo: meta?.flag ? getAwsImageUrl(meta.flag) : '/flags/defaultDaoFlag.png',
    flagCover: getAwsImageUrl(meta?.flagCover),
    flagLogo: getAwsImageUrl(meta?.flagLogo),
    funds: (daoDTO.totalDaoFunds ?? 0).toFixed(2),
    totalDaoFunds: daoDTO.totalDaoFunds ?? 0,
    createdAt: daoDTO.createdAt,
    groups: daoGroups,
    policy: daoDTO.policy,
    links: meta?.links || [],
    displayName: meta?.displayName || '',
    lastProposalId: daoDTO.lastProposalId,
    legal: meta?.legal || {},
    stakingContract: daoDTO.stakingContract,
  };
};

export const mapDaoDTOListToDaoList = (daoList: DaoDTO[]): DAO[] => {
  return daoList.reduce<DAO[]>((res, daoItem) => {
    const dao = mapDaoDTOtoDao(daoItem);

    if (dao) {
      res.push(dao);
    }

    return res;
  }, []);
};

/* eslint-disable camelcase */
type ContractParams = {
  purpose: string;
  bond: string;
  vote_period: string;
  grace_period: string;
  policy: {
    roles: RolesRequest[];
    default_vote_policy: VotePolicyRequest;
    proposal_bond: string;
    proposal_period: string;
    bounty_bond: string;
    bounty_forgiveness_period: string;
  };
  config: {
    name: string;
    purpose: string;
    metadata: string;
  };
};
/* eslint-enable camelcase */

export const mapCreateDaoParamsToContractParams = (
  params: CreateDaoParams
): ContractParams => {
  return {
    purpose: params.purpose,
    bond: new Decimal(params.bond).mul(YOKTO_NEAR).toFixed(),
    vote_period: new Decimal(params.votePeriod).mul('3.6e12').toFixed(),
    grace_period: new Decimal(params.gracePeriod).mul('3.6e12').toFixed(),
    policy: {
      roles: params.policy.roles,
      default_vote_policy: params.policy.defaultVotePolicy,
      proposal_bond: new Decimal(params.policy.proposalBond)
        .mul(YOKTO_NEAR)
        .toFixed(),
      proposal_period: new Decimal(params.policy.proposalPeriod)
        .mul('3.6e12')
        .toFixed(),
      bounty_bond: new Decimal(params.policy.bountyBond)
        .mul(YOKTO_NEAR)
        .toFixed(),
      bounty_forgiveness_period: new Decimal(
        params.policy.bountyForgivenessPeriod
      )
        .mul('3.6e12')
        .toFixed(),
    },
    config: {
      name: params.name,
      purpose: params.purpose,
      metadata: jsonToBase64Str({
        links: params.links,
        flagCover: params.flagCover,
        flagLogo: params.flagLogo,
        displayName: params.displayName,
        legal: params.legal,
      }),
    },
  };
};

export const mapCreateDaoParamsToContractArgs = (
  params: CreateDaoParams
): string => {
  const argsList = mapCreateDaoParamsToContractParams(params);

  return jsonToBase64Str(argsList);
};

export function mapSubscriptionsDTOsToDaoSubscriptions(
  data: DaoSubscriptionDTO[]
): DaoSubscription[] {
  return data.reduce<DaoSubscription[]>((res, item) => {
    const daoObj = mapDaoDTOtoDao(item.dao);

    if (daoObj) {
      res.push({
        ...item,
        dao: daoObj,
      });
    }

    return res;
  }, []);
}

export function mapDaoFeedItemResponseToDaoFeedItem(
  item: DaoFeedItemResponse
): DaoFeedItem {
  const config = get(item, 'config');
  const meta = config?.metadata ? fromBase64ToMetadata(config.metadata) : null;

  return {
    createdAt: item.createdAt ?? '',
    id: item.id,
    numberOfMembers: item.numberOfMembers,
    numberOfGroups: item.numberOfGroups,
    accountIds: item.accountIds,
    activeProposalCount: item.activeProposalCount,
    totalProposalCount: item.totalProposalCount,
    totalDaoFunds: item.totalDaoFunds,

    txHash: item.transactionHash ?? '',
    name: config?.name ?? '',
    description: config?.purpose ?? '',
    displayName: meta?.displayName ?? '',

    links: meta?.links || [],
    logo: meta?.flag ? getAwsImageUrl(meta.flag) : '/flags/defaultDaoFlag.png',
    flagCover: getAwsImageUrl(meta?.flagCover),
    flagLogo: getAwsImageUrl(meta?.flagLogo),
    legal: meta?.legal || {},
    policy: item.policy ?? {},

    council: item.council ?? null,
    isCouncil: item.isCouncil ?? null,
  };
}

export function mapDaoFeedItemResponseToDaoFeedItemList(
  data: DaoFeedItemResponse[]
): DaoFeedItem[] {
  return data.map(mapDaoFeedItemResponseToDaoFeedItem);
}

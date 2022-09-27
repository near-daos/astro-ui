import get from 'lodash/get';

import {
  CreateProposalParams,
  Proposal,
  ProposalKind,
  ProposalStatus,
  ProposalType,
  ProposalVariant,
  ProposalActionData,
  DaoConfig,
  ProposalFeedItem,
  ProposalDetails,
} from 'types/proposal';
import {
  DaoDTO,
  fromBase64ToMetadata,
  mapDaoDTOtoDao,
} from 'services/sputnik/mappers/dao';
import { DATA_SEPARATOR } from 'constants/common';
import { toMillis } from 'utils/format';
import { DaoStatsOvertime, DaoStatsProposalsOvertime } from 'types/daoStats';
import { ChartDataElement } from 'components/AreaChartRenderer/types';
import { CommonOverTime } from 'types/stats';
import { PaginationResponse } from 'types/api';

import { DaoPolicy } from 'services/sputnik/types/policy';

import { getAwsImageUrl } from './utils/getAwsImageUrl';

export type ProposalDTO = {
  createTimestamp: string;
  createdAt: string;
  daoId: string;
  commentsCount: number;
  description: string;
  id: string;
  isArchived: boolean;
  kind: ProposalKind;
  proposalId: number;
  proposer: string;
  status: ProposalStatus;
  voteStatus: string;
  submissionTime: string;
  transactionHash: string;
  updateTimestamp: string;
  updateTransactionHash: string;
  updatedAt: string;
  voteCounts: Record<string, number[]>;
  votes: Record<string, 'Approve' | 'Reject' | 'Remove'>;
  dao: DaoDTO;
  votePeriodEnd: string;
  actions: ProposalActionData[];
};

type VoteState = 'Yes' | 'No' | 'Dismiss';

export interface GetProposalsResponse {
  data: ProposalDTO[];
}

export function getVotesStatistic(proposal: Pick<ProposalDTO, 'votes'>): {
  voteYes: number;
  voteNo: number;
  voteRemove: number;
  votes: Record<string, VoteState>;
} {
  const result = {
    voteYes: 0,
    voteNo: 0,
    voteRemove: 0,
    votes: {} as Record<string, VoteState>,
  };

  Object.keys(proposal.votes).forEach(key => {
    let value: VoteState;

    if (proposal.votes[key] === 'Approve') {
      result.voteYes += 1;
      value = 'Yes';
    } else if (proposal.votes[key] === 'Reject') {
      result.voteNo += 1;
      value = 'No';
    } else {
      result.voteRemove += 1;
      value = 'Dismiss';
    }

    result.votes[key] = value;
  });

  return result;
}

export const mapProposalToProposers = (
  proposals: PaginationResponse<ProposalDTO[]>
): PaginationResponse<unknown[]> => {
  const proposers = new Set();

  proposals.data.forEach(proposal => {
    proposers.add(proposal.proposer);
  });

  return {
    ...proposals,
    data: Array.from(proposers),
  };
};

export const mapProposalDTOToProposal = (
  proposalDTO: ProposalDTO
): Proposal => {
  const [description, link, proposalVariant = ProposalVariant.ProposeDefault] =
    proposalDTO.description.split(DATA_SEPARATOR);

  const config = get(proposalDTO.dao, 'config');
  const meta = config?.metadata ? fromBase64ToMetadata(config.metadata) : null;

  const votePeriodEnd = new Date(
    toMillis(proposalDTO.votePeriodEnd)
  ).toISOString();

  return {
    ...getVotesStatistic(proposalDTO),
    id: proposalDTO.id,
    proposalId: proposalDTO.proposalId ?? 0,
    daoId: proposalDTO.daoId,
    proposer: proposalDTO.proposer,
    commentsCount: proposalDTO.commentsCount ?? 0,
    description,
    link: link ?? '',
    status: proposalDTO.status,
    kind: proposalDTO.kind,
    votePeriodEnd,
    votePeriodEndDate: votePeriodEnd,
    voteStatus: proposalDTO.voteStatus,
    isFinalized: proposalDTO.status === 'Expired',
    txHash: proposalDTO.transactionHash ?? '',
    createdAt: proposalDTO.createdAt,
    dao: mapDaoDTOtoDao(proposalDTO.dao),
    daoDetails: {
      name: proposalDTO.dao.config.name,
      displayName: meta?.displayName || '',
      logo: meta?.flag
        ? getAwsImageUrl(meta.flag)
        : '/flags/defaultDaoFlag.png',
    },
    proposalVariant: proposalVariant as ProposalVariant,
    updatedAt: proposalDTO.updateTimestamp
      ? new Date(Number(proposalDTO.updateTimestamp) / 1000000).toISOString()
      : null,
    actions: proposalDTO.actions,
  };
};

export const mapProposalFeedItemResponseToProposalDetails = (
  item: ProposalFeedItemResponse
): ProposalDetails => {
  const [description, , proposalVariant = ProposalVariant.ProposeDefault] =
    item.description.split(DATA_SEPARATOR);

  const config = get(item.dao, 'config');
  const meta = config?.metadata ? fromBase64ToMetadata(config.metadata) : null;

  return {
    daoId: item.daoId,
    id: item.id,
    description,
    proposalVariant: proposalVariant as ProposalVariant,
    type: item.type as ProposalType,
    status: item.status,
    kind: {
      type: item.type as ProposalType,
    },
    flag: meta ? getAwsImageUrl(meta.flagCover) : '',
  };
};

export const mapProposalFeedItemResponseToProposalFeedItem = (
  proposalDTO: ProposalFeedItemResponse
): ProposalFeedItem => {
  const [description, link, proposalVariant = ProposalVariant.ProposeDefault] =
    proposalDTO.description.split(DATA_SEPARATOR);

  const config = get(proposalDTO.dao, 'config');
  const meta = config?.metadata ? fromBase64ToMetadata(config.metadata) : null;

  const votePeriodEnd = new Date(
    toMillis(proposalDTO.votePeriodEnd)
  ).toISOString();

  return {
    ...getVotesStatistic(proposalDTO),
    id: proposalDTO.id,
    proposalId: proposalDTO.proposalId ?? 0,
    daoId: proposalDTO.daoId,
    proposer: proposalDTO.proposer,
    commentsCount: proposalDTO.commentsCount ?? 0,
    description,
    link: link ?? '',
    status: proposalDTO.status,
    kind: proposalDTO.kind,
    votePeriodEnd,
    votePeriodEndDate: votePeriodEnd,
    voteStatus: proposalDTO.voteStatus,
    isFinalized: proposalDTO.status === 'Expired',
    txHash: proposalDTO.transactionHash ?? '',
    createdAt: proposalDTO.createdAt,
    dao: {
      id: proposalDTO.dao?.id,
      name: proposalDTO.dao?.config.name ?? '',
      logo: meta?.flag
        ? getAwsImageUrl(meta.flag)
        : '/flags/defaultDaoFlag.png',
      flagCover: getAwsImageUrl(meta?.flagCover),
      flagLogo: getAwsImageUrl(meta?.flagLogo),
      legal: meta?.legal || {},
      numberOfMembers: proposalDTO.dao?.numberOfMembers,
      policy: proposalDTO.dao?.policy,
    },
    daoDetails: {
      name: proposalDTO.dao?.config.name ?? '',
      displayName: meta?.displayName || '',
      logo: meta?.flag
        ? getAwsImageUrl(meta.flag)
        : '/flags/defaultDaoFlag.png',
    },
    proposalVariant: proposalVariant as ProposalVariant,
    updatedAt: proposalDTO.updatedAt,
    actions: proposalDTO.actions,
    permissions: proposalDTO.permissions ?? {
      canApprove: false,
      canReject: false,
      canDelete: false,
      isCouncil: false,
    },
  };
};

export const mapProposalDTOToProposalExt = (
  proposalDTO: ProposalDTO
): Proposal => {
  return {
    ...mapProposalDTOToProposal(proposalDTO),
    status: proposalDTO.status,
    votePeriodEnd: proposalDTO.votePeriodEnd,
  };
};

export const mapProposalDTOListToProposalList = (
  proposalList: ProposalDTO[]
): Proposal[] => {
  return proposalList.map(proposalItem => {
    return mapProposalDTOToProposalExt(proposalItem);
  });
};

export const mapCreateParamsToPropsalKind = (
  params: CreateProposalParams
): ProposalKind => {
  switch (params.kind) {
    case 'AddBounty':
      return {
        type: ProposalType.AddBounty,
        bounty: {
          description: 'string',
          token: 'string',
          amount: 'string',
          times: 0,
          max_deadline: 'string',
        },
      };
    case 'AddMemberToRole':
      return {
        type: ProposalType.AddMemberToRole,
        memberId: 'string',
        role: 'string',
      };
    case 'BountyDone':
      return {
        type: ProposalType.BountyDone,
        receiverId: 'string;',
        bountyId: 'string;',
        completedDate: 'string',
      };
    case 'ChangeConfig':
      return {
        type: ProposalType.ChangeConfig,
        config: { metadata: 'string', name: 'string', purpose: 'string' },
      };
    case 'ChangePolicy':
      return {
        type: ProposalType.ChangePolicy,
        policy: {
          roles: [], // DaoRole
          bountyBond: 'string',
          proposalBond: 'string',
          proposalPeriod: 'string',
          defaultVotePolicy: {
            weightKind: 'string',
            kind: 'string',
            ratio: [], // number
            quorum: 'string',
            weight: 'string',
          },
          bountyForgivenessPeriod: 'string',
        },
      };
    case 'RemoveMemberFromRole':
      return {
        type: ProposalType.RemoveMemberFromRole,
        memberId: 'string',
        role: 'string',
      };
    case 'Transfer':
      return {
        type: ProposalType.Transfer,
        tokenId: 'string',
        receiverId: 'string',
        amount: 'string',
        msg: 'string',
      };
    case 'UpgradeRemote':
      return {
        type: ProposalType.UpgradeRemote,
        receiverId: 'string',
        hash: 'string',
        methodName: 'string',
      };
    case 'UpgradeSelf':
      return {
        type: ProposalType.UpgradeSelf,
        hash: 'string',
      };
    case 'Vote':
      return { type: ProposalType.Vote };
    default:
      throw new Error();
  }
};

export type ProposalFeedItemResponse = {
  createdAt: string;
  updatedAt: string;
  id: string;
  proposalId: number;
  updateTimestamp: number;
  transactionHash: string;
  daoId: string;
  proposer: string;
  description: string;
  status: 'Approved' | 'InProgress' | 'Rejected' | 'Expired';
  voteStatus: 'Active';
  kind: ProposalKind;
  type: string;
  votes: Record<string, 'Approve' | 'Reject' | 'Remove'>;
  votePeriodEnd: string;
  dao: {
    id: string;
    config: DaoConfig;
    numberOfMembers: number;
    policy: DaoPolicy;
  };
  actions: ProposalActionData[];
  commentsCount: number;
  permissions: {
    canApprove: boolean;
    canReject: boolean;
    canDelete: boolean;
    isCouncil: boolean;
  };
};

export function mapOvertimeToChartData(
  data: DaoStatsOvertime[]
): ChartDataElement[] {
  return (
    data.map(item => {
      const x = new Date(item.timestamp);
      const utcDay = x.getUTCDate();

      x.setDate(utcDay);

      const y = item.value;

      return {
        x,
        y,
      };
    }) ?? []
  );
}

export function mapProposalsOvertimeToChartData(
  data: DaoStatsProposalsOvertime[]
): ChartDataElement[] {
  return (
    data.reduce<ChartDataElement[]>((res, item) => {
      const x = new Date(item.timestamp);
      const utcDay = x.getUTCDate();

      x.setDate(utcDay);

      const { active, total } = item;

      res.push({
        x,
        y: active,
        y2: total,
      });

      return res;
    }, []) ?? []
  );
}

export function mapMetricsToChartData(
  data: CommonOverTime
): ChartDataElement[] {
  return (
    data?.metrics?.map(item => {
      const x = new Date(item.timestamp);
      const count = Number(item.count);

      return {
        x,
        y: count,
      };
    }) ?? []
  );
}

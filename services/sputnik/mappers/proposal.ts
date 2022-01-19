import get from 'lodash/get';
import { parseISO } from 'date-fns';

import {
  CreateProposalParams,
  Proposal,
  ProposalKind,
  ProposalStatus,
  ProposalType,
  ProposalVariant,
  ProposalActionData,
} from 'types/proposal';
import {
  DaoDTO,
  fromBase64ToMetadata,
  mapDaoDTOtoDao,
} from 'services/sputnik/mappers/dao';
import { EXTERNAL_LINK_SEPARATOR } from 'constants/common';

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
  status: 'Approved';
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

function getProposalVotingEndDate(
  submissionTime: string,
  proposalPeriod: string
): string {
  const endsAt = (Number(submissionTime) + Number(proposalPeriod)) / 1000000;

  return new Date(endsAt).toISOString();
}

function getVotesStatistic(proposal: ProposalDTO) {
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

function getProposalStatus(
  status: ProposalStatus,
  votingEndsAt: string
): ProposalStatus {
  if (status !== 'InProgress') {
    return status;
  }

  const now = new Date();
  const endsAt = parseISO(votingEndsAt);

  return now < endsAt ? 'InProgress' : 'Expired';
}

export const mapProposalDTOToProposal = (
  proposalDTO: ProposalDTO
): Proposal => {
  const [
    description,
    link,
    proposalVariant = ProposalVariant.ProposeDefault,
  ] = proposalDTO.description.split(EXTERNAL_LINK_SEPARATOR);

  const config = get(proposalDTO.dao, 'config');
  const meta = config?.metadata ? fromBase64ToMetadata(config.metadata) : null;

  const votePeriodEnd = getProposalVotingEndDate(
    get(proposalDTO, 'submissionTime'),
    get(proposalDTO, 'dao.policy.proposalPeriod')
  );

  return {
    ...getVotesStatistic(proposalDTO),
    id: proposalDTO.id,
    proposalId: proposalDTO.proposalId,
    daoId: proposalDTO.daoId,
    proposer: proposalDTO.proposer,
    commentsCount: proposalDTO.commentsCount ?? 0,
    description,
    link: link ?? '',
    status: getProposalStatus(proposalDTO.status, votePeriodEnd),
    kind: proposalDTO.kind,
    votePeriodEnd,
    votePeriodEndDate: votePeriodEnd,
    txHash: proposalDTO.transactionHash,
    createdAt: proposalDTO.createdAt,
    dao: mapDaoDTOtoDao(proposalDTO.dao),
    daoDetails: {
      name: proposalDTO.dao.config.name,
      displayName: meta?.displayName || '',
      logo: meta?.flag
        ? getAwsImageUrl(meta.flag)
        : getAwsImageUrl('default.png'),
    },
    proposalVariant: proposalVariant as ProposalVariant,
    updatedAt: proposalDTO.updateTimestamp
      ? new Date(Number(proposalDTO.updateTimestamp) / 1000000).toISOString()
      : null,
    actions: proposalDTO.actions,
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

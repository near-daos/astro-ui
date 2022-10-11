import {
  BountyIndex,
  DaoIndex,
  OpenSearchResponse,
  ProposalIndex,
  SearchResponseIndex,
  SearchResult,
} from 'services/SearchService/types';
import { DaoFeedItem } from 'types/dao';
import {
  ProposalComment,
  ProposalDetails,
  ProposalFeedItem,
  ProposalKind,
  ProposalType,
  ProposalVariant,
} from 'types/proposal';
import {
  fromBase64ToMetadata,
  getVotesStatistic,
} from 'services/sputnik/mappers';
import { DraftProposalFeedItem } from 'types/draftProposal';
import get from 'lodash/get';
import { getAwsImageUrl } from 'services/sputnik/mappers/utils/getAwsImageUrl';
import { DATA_SEPARATOR } from 'constants/common';
import { toMillis } from 'utils/format';
import { BountyContext } from 'types/bounties';

function mapDaoIndexToDaoFeedItem(daoIndex: DaoIndex): DaoFeedItem {
  const config = get(daoIndex, 'config');

  let meta;

  try {
    meta = config?.metadata ? fromBase64ToMetadata(config.metadata) : null;
  } catch (err) {
    console.error(`Failed to parse DAO metadata, daoId: ${daoIndex.id}`);

    meta = null;
  }

  return {
    createdAt: daoIndex.createTimestamp ?? '',
    id: daoIndex.id,
    numberOfMembers: daoIndex.numberOfMembers,
    numberOfGroups: daoIndex.numberOfGroups,
    accountIds: daoIndex.accountIds,
    activeProposalCount: daoIndex.activeProposalCount,
    totalProposalCount: daoIndex.totalProposalCount,
    totalDaoFunds: daoIndex.totalDaoFunds,

    txHash: daoIndex.transactionHash ?? '',
    name: config?.name ?? '',
    description: config?.purpose ?? '',
    displayName: meta?.displayName ?? '',

    links: meta?.links || [],
    logo: meta?.flag ? getAwsImageUrl(meta?.flag) : '/flags/defaultDaoFlag.png',
    flagCover: getAwsImageUrl(meta?.flagCover),
    flagLogo: getAwsImageUrl(meta?.flagLogo),
    legal: meta?.legal || {},
    policy: {
      daoId: daoIndex.id,
      roles: [], // ???
    },

    council: daoIndex.council ?? null,
    isCouncil: false,
  };
}

function getProposalKind(item: ProposalIndex): ProposalKind {
  switch (item.type) {
    case ProposalType.AddBounty: {
      return {
        type: ProposalType.AddBounty,
        bounty: item.bounty,
      };
    }
    case ProposalType.BountyDone: {
      return {
        type: ProposalType.BountyDone,
        receiverId: item.receiverId,
        bountyId: item.bountyId,
        completedDate: item.completeDate,
      };
    }
    case ProposalType.ChangePolicy: {
      return {
        type: ProposalType.ChangePolicy,
        policy: JSON.parse(item.policy),
      };
    }
    case ProposalType.ChangeConfig: {
      return {
        type: ProposalType.ChangeConfig,
        config: item.config,
      };
    }
    case ProposalType.AddMemberToRole: {
      return {
        type: ProposalType.AddMemberToRole,
        memberId: item.memberId,
        role: item.role,
      };
    }
    case ProposalType.RemoveMemberFromRole: {
      return {
        type: ProposalType.RemoveMemberFromRole,
        memberId: item.memberId,
        role: item.role,
      };
    }
    case ProposalType.FunctionCall: {
      return {
        type: ProposalType.FunctionCall,
        receiverId: item.receiverId,
        actions: item.actions,
      };
    }
    case ProposalType.Transfer: {
      return {
        type: ProposalType.Transfer,
        tokenId: item.tokenId,
        receiverId: item.receiverId,
        amount: item.amount,
        msg: item.msg,
      };
    }
    case ProposalType.SetStakingContract: {
      return {
        type: ProposalType.SetStakingContract,
        stakingId: item.stakingId,
      };
    }
    case ProposalType.UpgradeRemote: {
      return {
        type: ProposalType.UpgradeRemote,
        receiverId: item.receiverId,
        hash: item.hash,
        methodName: item.methodName,
      };
    }
    case ProposalType.UpgradeSelf: {
      return {
        type: ProposalType.UpgradeSelf,
        hash: item.hash,
      };
    }
    case ProposalType.Vote:
    default: {
      return {
        type: ProposalType.Vote,
      };
    }
  }
}

function mapProposalIndexToProposalFeedItem(
  item: ProposalIndex
): ProposalFeedItem {
  const [description, link, proposalVariant = ProposalVariant.ProposeDefault] =
    item.description.split(DATA_SEPARATOR);

  const config = get(item.dao, 'config');
  const meta = config?.metadata ? fromBase64ToMetadata(config.metadata) : null;

  const votePeriodEnd = new Date(toMillis(item.votePeriodEnd)).toISOString();

  return {
    ...getVotesStatistic({ votes: JSON.parse(item.votes) }),
    id: item.id,
    proposalId: item.proposalId ?? 0,
    daoId: item.daoId,
    proposer: item.proposer,
    commentsCount: item.commentsCount ?? 0,
    description,
    link: link ?? '',
    status: item.status,
    kind: getProposalKind(item),
    votePeriodEnd,
    votePeriodEndDate: votePeriodEnd,
    voteStatus: item.voteStatus,
    isFinalized: item.status === 'Expired',
    txHash: item.transactionHash ?? '',
    createdAt: '',
    dao: {
      id: item.dao?.id,
      name: item.dao?.config.name ?? '',
      logo: meta?.flag
        ? getAwsImageUrl(meta.flag)
        : '/flags/defaultDaoFlag.png',
      flagCover: getAwsImageUrl(meta?.flagCover),
      flagLogo: getAwsImageUrl(meta?.flagLogo),
      legal: meta?.legal || {},
      numberOfMembers: item.dao?.numberOfMembers,
      policy: item.dao ? JSON.parse(item.dao.policy) : {},
    },
    daoDetails: {
      name: item.dao?.config.name ?? '',
      displayName: meta?.displayName || '',
      logo: meta?.flag
        ? getAwsImageUrl(meta.flag)
        : '/flags/defaultDaoFlag.png',
    },
    proposalVariant: proposalVariant as ProposalVariant,
    updatedAt: '',
    actions: [],
    permissions: {
      canApprove: false,
      canReject: false,
      canDelete: false,
      isCouncil: false,
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function mapProposalIndexToProposalDetails(
  item: ProposalIndex
): ProposalDetails {
  const [description, , proposalVariant = ProposalVariant.ProposeDefault] =
    item.description.split(DATA_SEPARATOR);

  const config = get(item.dao, 'config');
  const meta = config?.metadata ? fromBase64ToMetadata(config.metadata) : null;

  return {
    daoId: item.daoId,
    id: item.id,
    description,
    proposalVariant: proposalVariant as ProposalVariant,
    type: item.type,
    status: item.status,
    kind: {
      type: item.type,
    },
    flag: meta ? getAwsImageUrl(meta.flagCover) : '',
  };
}

function mapBountyIndexToBountyContext(item: BountyIndex): BountyContext {
  const { proposal } = item;

  return {
    id: item.id,
    daoId: item.daoId,
    proposal: {
      id: proposal.id,
      daoId: proposal.daoId,
      bountyClaimId: proposal.bountyClaimId ?? '',
      proposalId: proposal.proposalId,
      createdAt: new Date(
        Number(proposal.createTimestamp) / 1000000
      ).toISOString(),
      updatedAt: '',
      description: proposal.description,
      transactionHash: proposal.transactionHash,
      voteYes: 0,
      voteNo: 0,
      voteRemove: 0,
      proposer: proposal.proposer,
      status: proposal.status,
      voteStatus: proposal.voteStatus,
      kind: {
        type: ProposalType.AddBounty,
        bounty: proposal.bounty,
      },
      votePeriodEnd: proposal.votePeriodEnd,
      votes: JSON.parse(proposal.votes),
      permissions: {
        canApprove: false,
        canReject: false,
        canDelete: false,
        isCouncil: false,
      },
    },
    bounty: {
      bountyId: item.bountyId,
      bountyClaims: JSON.parse(item.bountyClaims),
      daoId: item.daoId,
      id: item.id,
      amount: item.amount,
      bountyDoneProposals: JSON.parse(item.bountyDoneProposals),
      createdAt: new Date(Number(item.createTimestamp) / 1000000).toISOString(),
      description: item.description,
      maxDeadline: item.maxDeadline,
      proposalId: item.proposalId,
      times: item.times,
      token: item.token,
      numberOfClaims: item.numberOfClaims,
    },
    commentsCount: item.commentsCount,
  };
}

/* eslint-disable no-underscore-dangle */
export function mapOpenSearchResponseToSearchResult(
  query: string,
  index: SearchResponseIndex,
  data: OpenSearchResponse | null
): SearchResult {
  if (query === '' || !data) {
    return {
      total: 0,
      data: [],
    };
  }

  switch (index) {
    case SearchResponseIndex.DAO: {
      return {
        total: data.hits.total.value,
        data: data.hits.hits
          .filter(item => item._index === index)
          .map(item => {
            return mapDaoIndexToDaoFeedItem(item._source as DaoIndex);
          }),
      };
    }
    case SearchResponseIndex.PROPOSAL: {
      return {
        total: data.hits.total.value,
        data: data.hits.hits
          .filter(item => item._index === index)
          .map(item => {
            return mapProposalIndexToProposalFeedItem(
              item._source as ProposalIndex
            );
          }),
      };
    }

    case SearchResponseIndex.DRAFT_PROPOSAL: {
      return {
        total: data.hits.total.value,
        data: data.hits.hits
          .filter(item => item._index === index)
          .map(item => {
            return item._source as DraftProposalFeedItem;
          }),
      };
    }

    case SearchResponseIndex.COMMENT: {
      return {
        total: data.hits.total.value,
        data: data.hits.hits
          .filter(item => item._index === index)
          .map(item => {
            return item._source as ProposalComment;
          }),
      };
    }

    case SearchResponseIndex.BOUNTY: {
      return {
        total: data.hits.total.value,
        data: data.hits.hits
          .filter(item => item._index === index)
          .reduce<BountyContext[]>((res, item) => {
            const source = item._source as BountyIndex;

            if (!source.proposal) {
              return res;
            }

            res.push(mapBountyIndexToBountyContext(source));

            return res;
          }, []),
      };
    }

    default: {
      return {
        total: 0,
        data: [],
      };
    }
  }
}

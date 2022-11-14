import {
  BountyIndex,
  DaoIndex,
  DraftCommentIndex,
  DraftProposalIndex,
  NftIndex,
  OpenSearchResponse,
  ProposalIndex,
  SearchResponseIndex,
  SearchResult,
} from 'services/SearchService/types';
import { DaoFeedItem } from 'types/dao';
import {
  ProposalComment,
  ProposalFeedItem,
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
import { getParsedVotes } from 'services/SearchService/mappers/helpers';
import { NftToken } from 'types/token';
import { mapNftIndexToNftToken } from 'services/SearchService/mappers/nft';
import { mapDraftCommentIndexToDraftComment } from 'services/SearchService/mappers/draftComment';
import { mapDraftProposalIndexToDraftProposal } from 'services/SearchService/mappers/draft';
import { mapBountyIndexToBountyContext } from './bounty';

export function mapDaoIndexToDaoFeedItem(
  daoIndex: DaoIndex,
  accountId?: string
): DaoFeedItem {
  const config = get(daoIndex, 'config');

  let meta;

  try {
    meta = config?.metadata ? fromBase64ToMetadata(config.metadata) : null;
  } catch (err) {
    console.error(`Failed to parse DAO metadata, daoId: ${daoIndex.id}`);

    meta = null;
  }

  return {
    createdAt: new Date(toMillis(daoIndex.createTimestamp)).toISOString(),
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
    isCouncil: accountId ? daoIndex.council?.includes(accountId) : false,
  };
}

export function mapProposalIndexToProposalFeedItem(
  item: ProposalIndex
): ProposalFeedItem {
  const [description, link, proposalVariant = ProposalVariant.ProposeDefault] =
    item.description.split(DATA_SEPARATOR);

  const config = get(item.dao, 'config');
  const meta = config?.metadata ? fromBase64ToMetadata(config.metadata) : null;
  const votePeriodEnd = item.votePeriodEnd
    ? new Date(toMillis(item.votePeriodEnd)).toISOString()
    : '';

  const { policy } = item.dao;

  return {
    ...getVotesStatistic({ votes: getParsedVotes(item.votes) }),
    id: item.id,
    proposalId: item.proposalId ?? 0,
    daoId: item.daoId,
    proposer: item.proposer,
    commentsCount: item.commentsCount ?? 0,
    description,
    link: link ?? '',
    status: item.status,
    kind: item.kind,
    votePeriodEnd,
    votePeriodEndDate: votePeriodEnd,
    voteStatus: item.voteStatus ?? null,
    isFinalized: item.status === 'Expired',
    txHash: item.transactionHash ?? '',
    createdAt: item.createTimestamp
      ? new Date(toMillis(item.createTimestamp)).toISOString()
      : '',
    dao: {
      id: item.dao?.id,
      name: item.dao?.config?.name ?? '',
      logo: meta?.flag
        ? getAwsImageUrl(meta.flag)
        : '/flags/defaultDaoFlag.png',
      flagCover: getAwsImageUrl(meta?.flagCover),
      flagLogo: getAwsImageUrl(meta?.flagLogo),
      legal: meta?.legal || {},
      numberOfMembers: item.dao?.numberOfMembers,
      policy,
    },
    daoDetails: {
      name: item.dao?.config?.name ?? '',
      displayName: meta?.displayName || '',
      logo: meta?.flag
        ? getAwsImageUrl(meta.flag)
        : '/flags/defaultDaoFlag.png',
    },
    proposalVariant: proposalVariant as ProposalVariant,
    updatedAt: '',
    actions: item.actions ?? [],
    permissions: null,
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
            return mapDraftProposalIndexToDraftProposal(
              item._source as DraftProposalIndex
            ) as DraftProposalFeedItem;
          }),
      };
    }

    case SearchResponseIndex.DRAFT_PROPOSAL_COMMENT: {
      return {
        total: data.hits.total.value,
        data: data.hits.hits
          .filter(item => item._index === index)
          .map(item => {
            return mapDraftCommentIndexToDraftComment(
              item._source as DraftCommentIndex
            );
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

            if (!source.daoId) {
              return res;
            }

            res.push(mapBountyIndexToBountyContext(source));

            return res;
          }, []),
      };
    }

    case SearchResponseIndex.NFT: {
      return {
        total: data.hits.total.value,
        data: data.hits.hits
          .filter(item => item._index === index)
          .reduce<NftToken[]>((res, item) => {
            const source = item._source as NftIndex;

            if (!source.daoId || !source.metadata) {
              return res;
            }

            res.push(mapNftIndexToNftToken(source));

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

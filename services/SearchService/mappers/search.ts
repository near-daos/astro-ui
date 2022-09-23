import {
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
  ProposalVariant,
} from 'types/proposal';
import { fromBase64ToMetadata } from 'services/sputnik/mappers';
import { DraftProposalFeedItem } from 'types/draftProposal';
import get from 'lodash/get';
import { getAwsImageUrl } from 'services/sputnik/mappers/utils/getAwsImageUrl';
import { DATA_SEPARATOR } from 'constants/common';

function mapDaoIndexToDaoFeedItem(daoIndex: DaoIndex): DaoFeedItem {
  const config = get(daoIndex, 'config');
  const meta = config?.metadata ? fromBase64ToMetadata(config.metadata) : null;

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
    logo: meta?.flag ? getAwsImageUrl(meta.flag) : '/flags/defaultDaoFlag.png',
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
            return mapProposalIndexToProposalDetails(
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

    default: {
      return {
        total: 0,
        data: [],
      };
    }
  }
}

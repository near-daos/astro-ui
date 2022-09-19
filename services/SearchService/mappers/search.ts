import { SearchResultsData } from 'types/search';
import {
  OpenSearchResponse,
  SearchResponseIndex,
} from 'services/SearchService/types';
import { DaoFeedItem, Member } from 'types/dao';
import { ProposalComment, ProposalFeedItem } from 'types/proposal';
import {
  DaoFeedItemResponse,
  mapDaoFeedItemResponseToDaoFeedItem,
  mapProposalFeedItemResponseToProposalFeedItem,
  ProposalFeedItemResponse,
} from 'services/sputnik/mappers';
import { DraftProposalFeedItem } from 'types/draftProposal';

/* eslint-disable no-underscore-dangle */
export function mapOpenSearchResults(
  query: string,
  data: OpenSearchResponse
): SearchResultsData | null {
  if (query === '') {
    return null;
  }

  const {
    daosResults,
    proposalResults,
    membersResults,
    commentsResults,
    draftProposalsResults,
  } = data.hits.hits.reduce<{
    daosResults: DaoFeedItem[];
    proposalResults: ProposalFeedItem[];
    membersResults: Member[];
    commentsResults: ProposalComment[];
    draftProposalsResults: DraftProposalFeedItem[];
  }>(
    (res, item) => {
      // eslint-disable-next-line no-underscore-dangle
      switch (item._index) {
        case SearchResponseIndex.DAO: {
          res.daosResults.push(
            mapDaoFeedItemResponseToDaoFeedItem(
              item._source as DaoFeedItemResponse
            )
          );

          break;
        }
        case SearchResponseIndex.COMMENT: {
          res.commentsResults.push(item._source as ProposalComment);

          break;
        }
        case SearchResponseIndex.PROPOSAL: {
          res.proposalResults.push(
            mapProposalFeedItemResponseToProposalFeedItem(
              item._source as ProposalFeedItemResponse
            )
          );

          break;
        }
        case SearchResponseIndex.DRAFT_PROPOSAL: {
          res.draftProposalsResults.push(item._source as DraftProposalFeedItem);

          break;
        }
        default: {
          // do nothing for now
        }
      }

      return res;
    },
    {
      daosResults: [],
      proposalResults: [],
      membersResults: [],
      commentsResults: [],
      draftProposalsResults: [],
    }
  );

  return {
    query,
    daos: daosResults,
    proposals: proposalResults,
    members: membersResults,
    comments: commentsResults,
    drafts: draftProposalsResults,
  };
}

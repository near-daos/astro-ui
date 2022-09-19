import { CancelToken } from 'axios';
import {
  DaoFeedItemResponse,
  ProposalFeedItemResponse,
} from 'services/sputnik/mappers';
import { ProposalComment } from 'types/proposal';
import { DraftProposalFeedItem } from 'types/draftProposal';

export type BaseParams = {
  id?: string;
  offset?: number;
  limit?: number;
  sort?: string;
  filter?: string;
  createdBy?: string;
  query?: string;
};

export type SearchParams = {
  query: string;
  cancelToken: CancelToken;
  accountId: string;
} & BaseParams;

export enum SearchResponseIndex {
  DAO = 'dao',
  PROPOSAL = 'proposal',
  COMMENT = 'comment',
  DRAFT_PROPOSAL = 'draftproposal',
}

/* eslint-disable camelcase */
export type OpenSearchResponse = {
  hits: {
    hits: {
      _id: string;
      _index: SearchResponseIndex;
      _score: null;
      _type: '_doc';
      sort: string[];
      _source:
        | DaoFeedItemResponse
        | ProposalComment
        | ProposalFeedItemResponse
        | DraftProposalFeedItem;
    }[];
    max_score: null;
    total: {
      value: number;
      relation: 'eq';
    };
  };
  timed_out: boolean;
  took: number;
  _shards: {
    failed: number;
    skipped: number;
    successful: number;
    total: number;
  };
};

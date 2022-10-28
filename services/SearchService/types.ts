import { CancelToken } from 'axios';
import {
  ProposalActionData,
  ProposalComment,
  ProposalKind,
  ProposalType,
} from 'types/proposal';
import { DraftProposalFeedItem } from 'types/draftProposal';
import { SearchResultsData } from 'types/search';
import { DaoPolicy } from 'services/sputnik/types/policy';
import { DaoVersion } from 'types/dao';

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
  cancelToken?: CancelToken;
  accountId?: string;
  size?: number;
  field?: string;
  index?: string;
} & BaseParams;

export enum SearchResponseIndex {
  DAO = 'dao',
  PROPOSAL = 'proposal',
  COMMENT = 'comment',
  DRAFT_PROPOSAL = 'draftproposal',
  BOUNTY = 'bounty',
  NFT = 'nft',
  TOKEN = 'token',
}

export interface DaoIndex {
  accountIds: string[];
  accounts: string;
  activeProposalCount: number;
  amount: string;
  config: { name: string; purpose: string; metadata: string };
  council: string[];
  councilSeats: number;
  createTimestamp: string;
  createdBy: string;
  daoVersionHash: string;
  delegations: unknown[];
  description: string;
  id: string;
  lastBountyId: number;
  lastProposalId: number;
  link: string;
  metadata: string;
  name: string;
  numberOfAssociates: number;
  numberOfGroups: number;
  numberOfMembers: number;
  stakingContract: string;
  status: 'Inactive';
  totalDaoFunds: number;
  totalProposalCount: number;
  totalSupply: string;
  transactionHash: string;
  policy: DaoPolicy;
  daoVersion: DaoVersion;
}

export interface ProposalIndex {
  accounts: string;
  amount: string;
  bountyClaimId: null;
  bountyDoneId: null;
  commentsCount: number;
  createTimestamp: string;
  dao: DaoIndex;
  daoId: string;
  description: string;
  failure: null;
  id: string;
  msg: string;
  name: string;

  proposalId: number;
  proposer: string;
  receiverId: string;
  status: 'Approved' | 'InProgress' | 'Expired';
  submissionTime: string;
  tokenId: string;
  transactionHash: string;
  type: ProposalType;
  updateTimestamp: string | null;
  voteCounts: Record<string, string>;
  votePeriodEnd: string;
  voteStatus: 'Active';
  votes: string;

  kind: ProposalKind;
  actions: ProposalActionData[];
}

export interface BountyIndex {
  accounts: string;
  amount: string;
  bountyClaims: string;
  bountyDoneProposals: string;
  bountyId: number;
  commentsCount: number;
  createTimestamp: string;
  daoId: string;
  description: string;
  id: string;
  maxDeadline: string;
  name: string;
  numberOfClaims: number;
  proposal: ProposalIndex;
  proposalId: string;
  times: string;
  token: string;
  transactionHash: string;
}

export interface NftIndex {
  accounts: string;
  daoId: string;
  description: string;
  id: string;
  index: string;
  indexedBy: string;
  symbol: string;
  baseUri: string;
  tokenId: string;
  ownerId: string;
  contractId: string;
  metadata: {
    copies: 0;
    description: string;
    expiresAt: string;
    extra: string;
    issuedAt: string;
    media: string;
    mediaHash: string;
    reference: string;
    referenceHash: string;
    startsAt: string;
    title: string;
    updatedAt: string;
    approvedAccountIds: [string];
  };
  contract: {
    id: string;
    spec: string;
    name: string;
    symbol: string;
    icon: string;
    baseUri: string;
    reference: string;
    referenceHash: string;
  };
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
        | DaoIndex
        | ProposalComment
        | ProposalIndex
        | DraftProposalFeedItem
        | BountyIndex
        | TokenIndex
        | NftIndex;
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

export type SearchResult = {
  total: number;
  data:
    | SearchResultsData['daos']
    | SearchResultsData['proposals']
    | SearchResultsData['drafts']
    | SearchResultsData['comments']
    | SearchResultsData['bounties']
    | SearchResultsData['nfts'];
};

export interface OpenSearchQuery {
  bool?: {
    must?: Record<string, unknown>[];
    must_not?: Record<string, unknown>[];
    should?: Record<string, unknown>[];
  };
  match_all?: Record<string, unknown>;
}

export interface TokenIndex {
  accountId: string;
  balance: string;
  tokenId: string;
  partitionId: string;
  isArchived: boolean;
  token: {
    reference: null;
    symbol: string;
    totalSupply: string;
    price: null;
    decimals: number;
    icon: string;
    name: string;
    id: string;
    ownerId: string;
    spec: string;
    referenceHash: null;
  };
}

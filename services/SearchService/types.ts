import { CancelToken } from 'axios';
import {
  ProposalActionData,
  ProposalComment,
  ProposalKind,
  ProposalType,
  ProposalVariant,
} from 'types/proposal';
import { DraftProposal, DraftProposalFeedItem } from 'types/draftProposal';
import { SearchResultsData } from 'types/search';
import { DaoPolicy } from 'services/sputnik/types/policy';
import { DAO as TDAO, DaoDelegation, DaoVersion } from 'types/dao';
import { Settings } from 'types/settings';
import {
  NotificationMetadata,
  NotificationStatus,
  NotifiedActionType,
} from 'types/notification';

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
  DRAFT_PROPOSAL_COMMENT = 'draftproposalcomment',
}

export interface OnChainEntity {
  createTimestamp: string;
  updateTimestamp: string;
}

export interface OffChainEntity {
  creatingTimeStamp: number;
  processingTimeStamp: number;
}

export interface DaoIndex extends OnChainEntity {
  accountIds: string[];
  accounts: string;
  activeProposalCount: number;
  amount: string;
  config: { name: string; purpose: string; metadata: string };
  council: string[];
  councilSeats: number;
  createdBy: string;
  daoVersionHash: string;
  delegations?: DaoDelegation[];
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
  tokens: TokenIndex[];
  settings?: Settings;
}

export interface ProposalIndex extends OnChainEntity {
  accounts: string;
  amount: string;
  bountyClaimId: null;
  bountyDoneId: null;
  commentsCount: number;
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
  voteCounts: Record<string, string>;
  votePeriodEnd: string;
  voteStatus: 'Active';
  votes: string;

  kind: ProposalKind;
  actions: ProposalActionData[];
}

export interface BountyIndex extends OnChainEntity {
  accounts: string;
  amount: string;
  bountyClaims: string;
  bountyDoneProposals: string;
  bountyId: number;
  commentsCount: number;
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
  creatingTimeStamp?: number;
  processingTimeStamp?: number;
  tags?: string[];
}

export interface NftIndex extends OnChainEntity {
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
        | NftIndex
        | DraftProposalIndex
        | DraftCommentIndex
        | DaoStatsIndex
        | AccountIndex;
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
    | SearchResultsData['nfts']
    | SearchResultsData['draftProposalComments'];
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
  symbol: string;
  tokenId: string;
  balance: string;
  totalSupply: string;
  decimals: number;
  id: string;
  ownerId: string;
  icon?: string;
  price?: string;
}

export interface DraftProposalIndex extends OffChainEntity {
  saveAccounts: string[];
  kind: ProposalKind & { proposalVariant: ProposalVariant };
  proposer: string;
  description: string;
  history: {
    daoId: string;
    proposer: string;
    kind: ProposalKind;
    description: string;
    id: string;
    title: string;
    type: ProposalType;
    timestamp: number;
  }[];
  title: string;
  type: ProposalType;
  replies: number;
  id: string;
  state: DraftProposal['state'];
  viewAccounts: string[];
  dao: TDAO;
  daoId: string;
  accounts: string;
}

export interface DraftCommentIndex extends OffChainEntity {
  author: string;
  isArchived: boolean;
  contextId: string;
  message: string;
  likeAccounts: string[];
  contextType: 'DraftProposal';
  dislikeAccounts: string[];
  id: string;
  accounts: string;
  description: string;
  index: string;
  daoId: string;
  replyTo: string | undefined;
  replies: DraftCommentIndex[];
}

export interface DaoStatsIndex {
  nftCount: number;
  totalDaoFunds: number;
  processingTimeStamp: number;
  activeProposalCount: number;
  creatingTimeStamp: number;
  bountyCount: number;
  id: string;
  transactionsCount: number;
  timestamp: number;
  totalProposalCount: number;
  daoId: string;
  accounts: string;
  description: string;
  index: 'DaoStats';
}

export interface AccountIndex extends OffChainEntity {
  accountId: string;
  accounts: string;
  description: string;
  email: string;
  id: string;
  index: 'Account';
  isArchived: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  notifiAlertId: string;
  notifiUserId: string;
  phoneNumber: string;
}

export interface AccountNotificationIndex {
  accountId: string;
  accounts: string;
  dao: {
    metadata: {
      flagLogo: string;
      flagCover: string;
    };
  };
  daoId: string;
  description: string;
  id: string;
  index: 'AccountNotification';
  indexedBy: 'Enrichment Lambda';
  processingTimeStamp: number;
  isArchived: boolean;
  isPhone: boolean;
  isRead: boolean;
  ttl: number;
  notification: {
    metadata: NotificationMetadata;
    signerId: string | null;
    targetId: string;
    id: string;
    type: NotifiedActionType;
    status: NotificationStatus;
    timestamp: string;
  };
  creatingTimeStamp: number;
  isEmail: boolean;
  isMuted: boolean;
}

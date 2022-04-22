export type History = {
  from?: string;
  to?: string;
};

export type Params = {
  contract: string;
};

export type LimitParams = Params & {
  limit?: number;
  offset?: number;
};

export type IntervalParams = {
  interval: Interval;
};

export type HistoryParams = Params & History;
export type IntervalHistoryParams = Params & History & IntervalParams;

export type DaoParams = Params & {
  dao: string;
};

export type ProposalMetrics = {
  metrics: {
    financial: MetricItem[];
    governance: MetricItem[];
    bounties: MetricItem[];
    members: MetricItem[];
  };
};

export type Proposals = {
  bounties: number;
  financial: number;
  governance: number;
  members: number;
};

export type LeaderboardItem = {
  dao: string;
  proposalsByType?: Proposals;
  proposals?: TotalMetrics;
  voteRate?: TotalMetrics;
  activity?: TotalMetrics;
  overview?: MetricItem[];
};

export type Leaderboard = {
  leaderboard?: LeaderboardItem[];
  metrics?: LeaderboardItem[];
  incoming?: LeaderboardItem[];
  outgoing?: LeaderboardItem[];
  total: number;
  outgoingTotal: number;
  incomingTotal: number;
};

export type DaoHistoryParams = DaoParams & History;
export type DaoIntervalHistoryParams = DaoParams & History & IntervalParams;

export type Legal = {
  legalStatus?: string;
  legalLink?: string;
};

export type Metadata = {
  displayName?: string;
  flagCover?: string;
  flagLogo?: string;
  legal?: Legal;
  links?: string[];
};

export type Dao = {
  createdAt: string;
  dao: string;
  contractId: string;
  description: string;
  metadata: Metadata;
};

export type TvlTotalMetrics = {
  number: TotalMetrics;
  vl: TotalMetrics;
};

export type FlowTotalMetrics = {
  number: TotalMetrics;
};

export type TotalMetrics = {
  count: number;
  growth: number;
  countNear?: number;
};

export type MetricItem = {
  timestamp: number;
  count: number;
};

export type Metrics = {
  metrics: MetricItem[];
};

export type FlowMetricsItem = {
  timestamp: number;
  incoming: number;
  outgoing: number;
};

export type FlowMetrics = {
  metrics: FlowMetricsItem[];
};

export enum Currency {
  USD = 'USD',
}

export enum Coin {
  NEAR = 'NEAR',
}

export type PriceParams = { currency: Currency; coin: Coin };

export type PriceParamsHistory = PriceParams & History;

export enum Interval {
  MONTH = 'month',
  WEEK = 'week',
  DAY = 'day',
}

export type Flow = {
  totalIn: TotalMetrics;
  totalOut: TotalMetrics;
  transactionsIn: TotalMetrics;
  transactionsOut: TotalMetrics;
};

export type General = {
  dao: TotalMetrics;
  activity: TotalMetrics;
  groups: TotalMetrics;
  averageGroups: TotalMetrics;
};

export type Governance = {
  proposals: TotalMetrics;
  proposalsByType: Proposals;
  voteRate: TotalMetrics;
  activeProposals: TotalMetrics;
  activeVotes: TotalMetrics;
};

export type Tokens = {
  fts: TotalMetrics;
  nfts: TotalMetrics;
  ftsVl: TotalMetrics;
};

export type Tvl = {
  tvl: TotalMetrics;
  avgTvl: TotalMetrics;
  bountiesAndGrantsVl: TotalMetrics;
  ftsVl: TotalMetrics;
};

export type TvlDao = {
  grants: TvlTotalMetrics;
  bounties: TvlTotalMetrics;
  tvl: TotalMetrics;
};

export type Users = {
  users: TotalMetrics;
  members: TotalMetrics;
  averageUsers: TotalMetrics;
  interactions: TotalMetrics;
  averageInteractions: TotalMetrics;
  activeUsers: TotalMetrics;
};

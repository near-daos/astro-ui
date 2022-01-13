export type StatsState = {
  value: number;
  growth: number;
};

export type DaoStatsState = {
  daoId: string;
  timestamp: number;
  totalDaoFunds: StatsState;
  transactionsCount: StatsState;
  bountyCount: StatsState;
  nftCount: StatsState;
  activeProposalCount: StatsState;
  totalProposalCount: StatsState;
};

export type DaoStatsOvertime = {
  value: number;
  timestamp: number;
};

export type DaoStatsProposalsOvertime = {
  active: number;
  total: number;
  timestamp: number;
};

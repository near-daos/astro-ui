export type Metric = {
  timestamp: number;
  count: string;
};

export type FundsOverTime = {
  incoming: Metric[];
  outgoing: Metric[];
};

export type Stats = {
  count: number;
  growth: number;
};

export type DaoTvlMetric = {
  number: Stats;
  v1: Stats;
};

export type DaoTvl = {
  grants: DaoTvlMetric;
  bounties: DaoTvlMetric;
  tvl: Stats;
};

export type DaoTokensStat = {
  fts: Stats;
  nfts: Stats;
};

export type CommonOverTime = {
  metrics: Metric[];
};

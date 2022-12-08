import { DaoStatsIndex } from 'services/SearchService/types';
import { DaoStatsState } from 'types/daoStats';

export function mapDaoStatsIndexToChartData(
  daoStatsIndex: DaoStatsIndex
): DaoStatsState {
  return {
    daoId: daoStatsIndex.daoId,
    timestamp: daoStatsIndex.timestamp,
    totalDaoFunds: { value: daoStatsIndex.totalDaoFunds, growth: 0 },
    transactionsCount: { value: daoStatsIndex.transactionsCount, growth: 0 },
    bountyCount: { value: daoStatsIndex.bountyCount, growth: 0 },
    nftCount: { value: daoStatsIndex.nftCount, growth: 0 },
    activeProposalCount: {
      value: daoStatsIndex.activeProposalCount,
      growth: 0,
    },
    totalProposalCount: { value: daoStatsIndex.totalProposalCount, growth: 0 },
  };
}

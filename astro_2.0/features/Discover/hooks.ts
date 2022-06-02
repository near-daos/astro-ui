import { PaginationResponse } from 'types/api';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import axios, { CancelTokenSource } from 'axios';
import { useAsyncFn } from 'react-use';
import { SputnikHttpService } from 'services/sputnik';
import { DaoFeedItem } from 'types/dao';
import useQuery from 'hooks/useQuery';
import { ChartDataElement } from 'components/AreaChartRenderer/types';

import { LeaderboardData, TControlTab } from './types';

export function useDaoSearch(): {
  handleSearch: (
    val: string
  ) => Promise<PaginationResponse<DaoFeedItem[]> | null>;
  loading: boolean;
} {
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);

  const [{ loading }, handleSearch] = useAsyncFn(async query => {
    if (cancelTokenRef.current) {
      cancelTokenRef.current?.cancel('Cancelled by new req');
    }

    const { CancelToken } = axios;
    const source = CancelToken.source();

    cancelTokenRef.current = source;

    return SputnikHttpService.findDaoByName({
      query,
      cancelToken: source.token,
    });
  }, []);

  return {
    handleSearch,
    loading,
  };
}

type DiscoveryState = {
  resetData: (id: string) => void;
  offset: number;
  setOffset: Dispatch<SetStateAction<number>>;
  total: number;
  setTotal: Dispatch<SetStateAction<number>>;
  leaderboardData: LeaderboardData[] | null;
  setLeaderboardData: Dispatch<SetStateAction<LeaderboardData[] | null>>;
  chartData: ChartDataElement[] | null;
  setChartData: Dispatch<SetStateAction<ChartDataElement[] | null>>;
  activeView: string;
  setActiveView: Dispatch<SetStateAction<string>>;
};

export const useDiscoveryState = (items: TControlTab[]): DiscoveryState => {
  const { query } = useQuery<{ dao: string }>();
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [leaderboardData, setLeaderboardData] = useState<
    LeaderboardData[] | null
  >(null);
  const [chartData, setChartData] = useState<ChartDataElement[] | null>(null);
  const [activeView, setActiveView] = useState(items[0].id);

  const resetData = useCallback(() => {
    setOffset(0);
    setTotal(0);
    setLeaderboardData(null);
    setChartData(null);
  }, []);

  useEffect(() => {
    resetData();
  }, [query.dao, resetData]);

  return {
    resetData,
    offset,
    setOffset,
    total,
    setTotal,
    leaderboardData,
    setLeaderboardData,
    chartData,
    setChartData,
    activeView,
    setActiveView,
  };
};

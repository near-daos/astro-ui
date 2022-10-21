import { useProposalsInfinite } from 'services/ApiService/hooks/useProposals';
import { ProposalCategories, ProposalFeedItem } from 'types/proposal';
import { useCallback, useMemo } from 'react';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';

type FeedOptions = {
  isMyFeed?: boolean;
  category?: ProposalCategories;
};

export function useProposalsFeed(options?: FeedOptions): {
  handleFilterChange: () => void;
  handleLoadMore: () => void;
  proposalsData: {
    data: ProposalFeedItem[];
    total: number;
  };
  isValidating: boolean;
  hasMore: boolean;
  dataLength: number;
} {
  const { size, setSize, data, isValidating } = useProposalsInfinite(options);

  const handleFilterChange = useCallback(() => {
    window.scroll(0, 0);
  }, []);

  const handleLoadMore = useCallback(() => setSize(size + 1), [setSize, size]);

  const proposalsData = useMemo(() => {
    return {
      data:
        data?.reduce<ProposalFeedItem[]>((acc, item) => {
          acc.push(...item.data);

          return acc;
        }, []) ?? [],
      total: 0,
    };
  }, [data]);

  const hasMore = data
    ? data[data?.length - 1].data.length === LIST_LIMIT_DEFAULT
    : false;

  const dataLength = data?.length ?? 0;

  return {
    handleFilterChange,
    handleLoadMore,
    proposalsData,
    isValidating,
    hasMore,
    dataLength,
  };
}

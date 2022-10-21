import { BountyContext } from 'types/bounties';
import { useBountiesInfinite } from 'services/ApiService/hooks/useBounties';
import { useCallback, useMemo } from 'react';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';

export function useBountiesFeed(): {
  handleFilterChange: () => void;
  handleLoadMore: () => void;
  bountiesData: {
    data: BountyContext[];
    total: number;
  };
  isValidating: boolean;
  hasMore: boolean;
  dataLength: number;
} {
  const { size, setSize, data, isValidating } = useBountiesInfinite();

  const handleFilterChange = useCallback(() => {
    window.scroll(0, 0);
  }, []);

  const handleLoadMore = useCallback(() => setSize(size + 1), [setSize, size]);

  const bountiesData = useMemo(() => {
    return {
      data:
        data?.reduce<BountyContext[]>((acc, item) => {
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
    bountiesData,
    isValidating,
    hasMore,
    dataLength,
  };
}

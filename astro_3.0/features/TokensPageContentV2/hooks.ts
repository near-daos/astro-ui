import { useCallback, useMemo } from 'react';
import { useTransactionsInfinite } from 'services/ApiService/hooks/useTransactions';
import { Receipt } from 'types/transaction';

export function useTransactionsFeed(tokenId: string): {
  handleFilterChange: () => void;
  handleLoadMore: () => void;
  transactionsData: {
    data: Receipt[];
    total: number;
  };
  isValidating: boolean;
  hasMore: boolean;
  dataLength: number;
} {
  const { size, setSize, data, isValidating } =
    useTransactionsInfinite(tokenId);

  const handleFilterChange = useCallback(() => {
    window.scroll(0, 0);
  }, []);

  const handleLoadMore = useCallback(() => setSize(size + 1), [setSize, size]);

  const transactionsData = useMemo(() => {
    return {
      data:
        data?.reduce<Receipt[]>((acc, item) => {
          acc.push(...item.data);

          return acc;
        }, []) ?? [],
      total: 0,
    };
  }, [data]);

  const hasMore = data ? !!data[data.length - 1].nextToken : false;

  const dataLength = data?.length ?? 0;

  return {
    handleFilterChange,
    handleLoadMore,
    transactionsData,
    isValidating,
    hasMore,
    dataLength,
  };
}

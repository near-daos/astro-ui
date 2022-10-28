import { useCallback, useMemo } from 'react';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';
import { DraftProposalFeedItem } from 'types/draftProposal';
import { useDraftProposalsInfinite } from 'services/ApiService/hooks/useDraftProposals';
import { PaginationResponse } from 'types/api';

export function useDraftsFeed(): {
  handleFilterChange: () => void;
  handleLoadMore: () => void;
  draftsData: {
    data: DraftProposalFeedItem[];
    total: number;
  };
  isValidating: boolean;
  hasMore: boolean;
  dataLength: number;
  handleSearch: (val: string) => Promise<PaginationResponse<unknown[]>>;
  handleReset: () => void;
} {
  const { size, setSize, data, isValidating } = useDraftProposalsInfinite();

  const handleFilterChange = useCallback(() => {
    window.scroll(0, 0);
  }, []);

  const handleLoadMore = useCallback(() => setSize(size + 1), [setSize, size]);

  const handleSearch = useCallback(() => {
    return Promise.resolve({ total: 0, data: [] });
  }, []);

  const handleReset = useCallback(() => {
    // todo - reset search
  }, []);

  const draftsData = useMemo(() => {
    return {
      data:
        data?.reduce<DraftProposalFeedItem[]>((acc, item) => {
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
    draftsData,
    isValidating,
    hasMore,
    dataLength,
    handleSearch,
    handleReset,
  };
}

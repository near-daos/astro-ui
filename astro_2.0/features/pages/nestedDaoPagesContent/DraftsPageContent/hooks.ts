import { PaginationResponse } from 'types/api';
import { DraftProposalFeedItem } from 'types/draftProposal';
import { useRouter } from 'next/router';
import { useAsyncFn, useMountedState } from 'react-use';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';
import { useCallback, useState } from 'react';
import { useWalletContext } from 'context/WalletContext';
import { useDebounceEffect } from 'hooks/useDebounceUpdateEffect';
import { useDraftsContext } from 'astro_2.0/features/Drafts/components/DraftsProvider/DraftsProvider';

type PageData = PaginationResponse<DraftProposalFeedItem[]>;

export function useDraftsPageData(
  daoId: string
): {
  loading: boolean;
  loadMore: () => void;
  data: PageData | null;
  handleSearch: (val: string) => Promise<PageData | null>;
  handleReset: () => void;
} {
  const router = useRouter();
  const isMounted = useMountedState();
  const { accountId } = useWalletContext();

  const { draftsService } = useDraftsContext();

  const { query } = router;

  const [data, setData] = useState<PageData | null>(null);

  const [{ loading }, fetchData] = useAsyncFn(
    async (_initialData?: PageData | null, searchInput?: string) => {
      let accumulatedListData = _initialData || null;

      const res = await draftsService.getDrafts({
        offset: accumulatedListData?.data.length || 0,
        limit: LIST_LIMIT_DEFAULT,
        orderBy: query.sort as string,
        daoId,
        category: query.category as string,
        accountId,
        searchInput,
      });

      if (!res) {
        return null;
      }

      accumulatedListData = {
        ...res,
        data: [...(accumulatedListData?.data || []), ...(res.data || [])],
      };

      return accumulatedListData;
    },
    [query.sort, query.category, accountId, daoId]
  );

  const handleSearch = useCallback(
    async searchInput => {
      const newData = await fetchData(null, searchInput);

      if (isMounted()) {
        setData(newData);
      }

      window.scroll(0, 0);

      return Promise.resolve(null);
    },
    [fetchData, isMounted]
  );

  const handleReset = useCallback(async () => {
    const newData = await fetchData();

    if (isMounted()) {
      setData(newData);
    }
  }, [fetchData, isMounted]);

  useDebounceEffect(
    async ({ isInitialCall, depsHaveChanged }) => {
      if (isInitialCall || !depsHaveChanged) {
        return;
      }

      const newData = await fetchData();

      if (isMounted()) {
        setData(newData);
      }

      window.scroll(0, 0);
    },
    1000,
    [query.sort, query.category]
  );

  const loadMore = async () => {
    if (loading) {
      return;
    }

    const newData = await fetchData(data);

    if (isMounted()) {
      setData(newData);
    }
  };

  return {
    data,
    handleSearch,
    loading,
    loadMore,
    handleReset,
  };
}

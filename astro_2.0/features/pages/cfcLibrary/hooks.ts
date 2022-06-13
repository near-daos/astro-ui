import { useCallback, useEffect, useState } from 'react';
import { useAsyncFn, useMountedState } from 'react-use';
import { SputnikHttpService } from 'services/sputnik';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';
import { PaginationResponse } from 'types/api';
import { SharedProposalTemplate } from 'types/proposalTemplate';
import { useRouter } from 'next/router';
import { useDebounceEffect } from 'hooks/useDebounceUpdateEffect';

export type PageData = PaginationResponse<SharedProposalTemplate[]>;

export function useCfcLibraryData(): {
  loading: boolean;
  loadMore: () => void;
  data: PageData | null;
  handleSearch: (val: string) => Promise<PageData | null>;
  handleReset: () => void;
} {
  const router = useRouter();
  const isMounted = useMountedState();
  const { query } = router;
  const [data, setData] = useState<PageData | null>(null);

  const [{ loading }, fetchData] = useAsyncFn(
    async (_initialData?: PageData | null, searchInput?: string) => {
      let accumulatedListData = _initialData || null;

      const res = await SputnikHttpService.getSharedProposalTemplates({
        offset: accumulatedListData?.data.length || 0,
        limit: LIST_LIMIT_DEFAULT,
        sort: query.sort as string,
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
    [query.sort]
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
    [query.sort]
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
    loading,
    loadMore,
    data,
    handleSearch,
    handleReset,
  };
}

export function useSharedTemplatePageData(): {
  data: SharedProposalTemplate | null;
  loading: boolean;
} {
  const router = useRouter();
  const isMounted = useMountedState();
  const {
    query: { template },
  } = router;

  const templateId = template as string;

  const [data, setData] = useState<SharedProposalTemplate | null>(null);

  const [{ loading }, fetchData] = useAsyncFn(async () => {
    const res = await SputnikHttpService.getSharedProposalTemplate(templateId);

    if (res && isMounted()) {
      setData(res);
    }
  }, [templateId, isMounted]);

  useEffect(() => {
    (async () => {
      await fetchData();
    })();
  }, [fetchData]);

  return {
    data,
    loading,
  };
}

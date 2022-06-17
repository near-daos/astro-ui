import { useCallback, useEffect, useState } from 'react';
import { useAsyncFn, useMountedState } from 'react-use';
import { SputnikHttpService } from 'services/sputnik';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';
import { PaginationResponse } from 'types/api';
import { SharedProposalTemplate } from 'types/proposalTemplate';
import { useRouter } from 'next/router';
import { useDebounceEffect } from 'hooks/useDebounceUpdateEffect';
import { useWalletContext } from 'context/WalletContext';

export type PageData = PaginationResponse<SharedProposalTemplate[]>;

export function useCfcLibraryData(): {
  loading: boolean;
  loadMore: () => void;
  data: PageData | null;
  handleSearch: (val: string) => Promise<PageData | null>;
  handleReset: () => void;
  onUpdate: (templateId: string, daosCount: number) => void;
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

  const onUpdate = useCallback(
    (templateId, daosCount) => {
      if (!data) {
        return;
      }

      const newData = data.data.map(item => {
        if (templateId === item.id) {
          return {
            ...item,
            daoCount: item.daoCount + daosCount,
          };
        }

        return item;
      });

      setData({
        ...data,
        data: newData,
      });
    },
    [data]
  );

  return {
    loading,
    loadMore,
    data,
    handleSearch,
    handleReset,
    onUpdate,
  };
}

type CloneDaoParams = { templateId: string; targetDao: string };

export function useCloneCfcTemplate(): {
  cloning: boolean;
  cloneToDao: (
    params: CloneDaoParams[]
  ) => Promise<({ proposalTemplateId: string; daoId: string } | null)[]>;
} {
  const { accountId, pkAndSignature } = useWalletContext();

  const [{ loading: cloning }, cloneToDao] = useAsyncFn(
    async (params: CloneDaoParams[]) => {
      if (pkAndSignature?.publicKey && pkAndSignature?.signature) {
        return Promise.all(
          params.map(({ templateId, targetDao }) =>
            SputnikHttpService.cloneTemplateToDao({
              templateId,
              targetDao,
              accountId,
              publicKey: pkAndSignature.publicKey ?? '',
              signature: pkAndSignature.signature ?? '',
            })
          )
        );
      }

      return Promise.resolve([]);
    },
    [accountId, pkAndSignature]
  );

  return {
    cloning,
    cloneToDao,
  };
}

export function useSharedTemplatePageData(): {
  data: SharedProposalTemplate | null;
  loading: boolean;
  templateId: string;
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
    templateId,
  };
}

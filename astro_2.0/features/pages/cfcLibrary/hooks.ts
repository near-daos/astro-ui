import { useCallback, useEffect, useState } from 'react';
import { useAsyncFn, useMount, useMountedState } from 'react-use';
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
  handleSearch: (val: string) => Promise<void>;
  handleReset: () => void;
  onUpdate: (templateId: string, daosCount: number) => void;
} {
  const router = useRouter();
  const isMounted = useMountedState();
  const { query } = router;
  const [data, setData] = useState<PageData | null>(null);

  const [{ loading }, fetchData] = useAsyncFn(
    async (_initialData?: PageData | null) => {
      let accumulatedListData = _initialData || null;

      const res = await SputnikHttpService.getSharedProposalTemplates({
        offset: accumulatedListData?.data.length || 0,
        limit: LIST_LIMIT_DEFAULT,
        sort: query.sort as string,
        searchInput: (query.search as string) ?? '',
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
    [query.sort, query.search]
  );

  const handleSearch = useCallback(
    async value => {
      const nextQuery = {
        ...query,
        search: value,
      };

      await router.replace(
        {
          query: nextQuery,
        },
        undefined,
        { shallow: true, scroll: false }
      );
    },
    [query, router]
  );

  const handleReset = useCallback(async () => {
    const nextQuery = {
      ...query,
      search: '',
    };

    await router.replace(
      {
        query: nextQuery,
      },
      undefined,
      { shallow: true, scroll: false }
    );
  }, [query, router]);

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
    [query.sort, query.search]
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

  useMount(() => loadMore());

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
  loadingSmartContractData: boolean;
  templatesBySmartContract: SharedProposalTemplate[] | null | undefined;
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

  const [
    { loading: loadingSmartContractData, value: templatesBySmartContract },
    fetchSmartContractData,
  ] = useAsyncFn(async () => {
    if (!data) {
      return null;
    }

    return SputnikHttpService.getTemplatesBySmartContract(
      data.config.smartContractAddress,
      templateId
    );
  }, [data, templateId]);

  useEffect(() => {
    fetchSmartContractData();
  }, [fetchSmartContractData]);

  useEffect(() => {
    (async () => {
      await fetchData();
    })();
  }, [fetchData]);

  return {
    data,
    loading,
    templateId,
    loadingSmartContractData,
    templatesBySmartContract,
  };
}

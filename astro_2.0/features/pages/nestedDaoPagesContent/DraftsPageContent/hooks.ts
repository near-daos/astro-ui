import { PaginationResponse } from 'types/api';
import { DraftProposalFeedItem } from 'types/draftProposal';
import { useRouter } from 'next/router';
import { useAsyncFn, useMount, useMountedState } from 'react-use';
import { useCallback, useState } from 'react';
import { useWalletContext } from 'context/WalletContext';
import { useDebounceEffect } from 'hooks/useDebounceUpdateEffect';
import { useDraftsContext } from 'astro_2.0/features/Drafts/components/DraftsProvider';
import { getDraftProposalTypeByCategory } from 'astro_2.0/features/pages/nestedDaoPagesContent/DraftsPageContent/helpers';
import { ProposalCategories } from 'types/proposal';
import { NOTIFICATION_TYPES, showNotification } from 'features/notifications';

type PageData = PaginationResponse<DraftProposalFeedItem[]>;

export function useDraftsPageData(daoId: string): {
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
  const { sort, category, state, view } = query;

  const [data, setData] = useState<PageData | null>(null);

  const [{ loading }, fetchData] = useAsyncFn(
    async (_initialData?: PageData | null, search?: string) => {
      let accumulatedListData = _initialData || null;

      const [orderBy, order] = (sort as string).split(',');

      const res = await draftsService.getDrafts({
        offset: accumulatedListData?.data.length || 0,
        limit: 1000,
        orderBy,
        order: order === 'ASC' || order === 'DESC' ? order : undefined,
        daoId,
        type: getDraftProposalTypeByCategory(category as ProposalCategories),
        accountId,
        search,
        state: state === 'open' || state === 'closed' ? state : undefined,
        isSaved: view === 'saved' ? 'true' : undefined,
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
    [sort, category, accountId, daoId, state, view]
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
    [fetchData]
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

  useMount(() => {
    if (!sort) {
      router.replace(
        {
          pathname: router.pathname,
          query: {
            ...query,
            sort: 'updatedAt,DESC',
          },
        },
        undefined,
        {
          shallow: true,
        }
      );
    }
  });

  return {
    data,
    handleSearch,
    loading,
    loadMore,
    handleReset,
  };
}

export function useDraftsPageActions(): {
  handleView: (id: string) => void;
} {
  const { accountId, pkAndSignature } = useWalletContext();
  const { draftsService } = useDraftsContext();

  const handleView = useCallback(
    async (id: string) => {
      try {
        if (!pkAndSignature) {
          return;
        }

        const { publicKey, signature } = pkAndSignature;

        if (!publicKey || !signature) {
          return;
        }

        await draftsService.updateDraftView({
          id,
          accountId,
          publicKey,
          signature,
        });
      } catch (e) {
        showNotification({
          type: NOTIFICATION_TYPES.ERROR,
          lifetime: 20000,
          description: e?.message,
        });
      }
    },
    [accountId, draftsService, pkAndSignature]
  );

  return {
    handleView,
  };
}

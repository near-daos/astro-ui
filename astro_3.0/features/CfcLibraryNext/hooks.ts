import { useCallback, useMemo } from 'react';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';
import { useCfcTemplatesInfinite } from 'services/ApiService/hooks/useCfcTemplates';
import { SharedProposalTemplate } from 'types/proposalTemplate';
import { KeyedMutator } from 'swr';
import { useRouter } from 'next/router';
import useQuery from 'hooks/useQuery';

export function useCfcFeed(): {
  handleFilterChange: () => void;
  handleLoadMore: () => void;
  templatesData: {
    data: SharedProposalTemplate[];
    total: number;
  };
  isValidating: boolean;
  hasMore: boolean;
  dataLength: number;
  mutate: KeyedMutator<{ data: SharedProposalTemplate[]; total: number }[]>;
  handleSearch: (val: string) => Promise<void>;
  handleReset: () => void;
  handleSort: (val: string) => Promise<void>;
} {
  const { query } = useQuery<{ sort: string; view: string }>();
  const router = useRouter();
  const { size, setSize, data, isValidating, mutate } =
    useCfcTemplatesInfinite();

  const handleFilterChange = useCallback(() => {
    window.scroll(0, 0);
  }, []);

  const handleLoadMore = useCallback(() => setSize(size + 1), [setSize, size]);

  const templatesData = useMemo(() => {
    return {
      data:
        data?.reduce<SharedProposalTemplate[]>((acc, item) => {
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

  const handleSort = useCallback(
    async value => {
      const nextQuery = {
        ...query,
        sort: value,
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

  return {
    handleFilterChange,
    handleLoadMore,
    templatesData,
    isValidating,
    hasMore,
    dataLength,
    mutate,
    handleSearch,
    handleReset,
    handleSort,
  };
}

import useSWR, { KeyedMutator } from 'swr';
import useSWRInfinite, { SWRInfiniteResponse } from 'swr/infinite';
import axios from 'axios';
import { PaginationResponse } from 'types/api';
import {
  ProposalFeedItem,
  ProposalCategories,
  ProposalsFeedStatuses,
} from 'types/proposal';
import { buildProposalsQuery } from 'services/SearchService/builders/proposals';
import { mapOpenSearchResponseToSearchResult } from 'services/SearchService/mappers/search';
import { SearchResponseIndex } from 'services/SearchService/types';
import { useRouter } from 'next/router';
import { appConfig } from 'config';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';
import { useWalletContext } from 'context/WalletContext';

const PROPOSALS_DEDUPING_INTERVAL = 10000;

async function fetcher(
  url: string,
  daoId: string,
  status: string,
  category: string,
  offset: number,
  limit: number,
  accountId?: string,
  proposer?: string
) {
  const sort = 'createTimestamp,DESC';
  const sortOptions = sort.split(',');
  const baseUrl = process.browser
    ? window.APP_CONFIG.SEARCH_API_URL
    : appConfig.SEARCH_API_URL;

  const response = await axios.post(
    `${baseUrl}/proposal/_search?size=${limit}&from=${offset}`,
    {
      query: buildProposalsQuery(
        {
          category: category as ProposalCategories,
          daoId,
          status: status as ProposalsFeedStatuses,
          proposers: proposer as string,
        },
        accountId
      ),
      sort: [
        {
          [sortOptions[0]]: {
            order: sortOptions[1].toLowerCase(),
          },
        },
      ],
    }
  );

  const mappedData = mapOpenSearchResponseToSearchResult(
    'proposal',
    SearchResponseIndex.PROPOSAL,
    response.data
  );

  return {
    data: mappedData.data as ProposalFeedItem[],
    total: mappedData.total,
    count: 0,
    page: 0,
    pageCount: 0,
  };
}

export function useProposals(page = 1): {
  proposals: PaginationResponse<ProposalFeedItem[]> | undefined;
  isLoading: boolean;
  isError: boolean;
  mutate: KeyedMutator<PaginationResponse<ProposalFeedItem[]>>;
} {
  const router = useRouter();
  const { query } = router;

  const limit = LIST_LIMIT_DEFAULT;
  const status = query.status ?? '';
  const category = query.category ?? '';
  const daoId = query.dao ?? '';
  const offset = page * limit;

  const { data, error, mutate } = useSWR<
    PaginationResponse<ProposalFeedItem[]>
  >(['proposals', daoId, status, category, offset, limit], fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: PROPOSALS_DEDUPING_INTERVAL,
  });

  return {
    proposals: data,
    isLoading: !data,
    isError: !!error,
    mutate,
  };
}

export function useProposalsInfinite(isMyFeed?: boolean): SWRInfiniteResponse<{
  data: ProposalFeedItem[];
  total: number;
  count: number;
  page: number;
  pageCount: number;
}> {
  const router = useRouter();
  const { query } = router;

  const { accountId } = useWalletContext();

  const limit = LIST_LIMIT_DEFAULT;
  const status = query.status ?? '';
  const category = query.category ?? '';
  const daoId = query.dao ?? '';
  const proposer = query.proposer ?? '';

  return useSWRInfinite(
    index => {
      const offset = index * limit;

      return [
        'proposals',
        daoId,
        status,
        category,
        offset,
        limit,
        isMyFeed ? accountId : undefined,
        proposer,
      ];
    },
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: PROPOSALS_DEDUPING_INTERVAL,
      // revalidateFirstPage: false,
      revalidateOnMount: true,
    }
  );
}

import useSWRInfinite, { SWRInfiniteResponse } from 'swr/infinite';
import axios from 'axios';
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
import { PaginationResponse } from 'types/api';

const PROPOSALS_DEDUPING_INTERVAL = 10000;

export async function fetcher(
  url: string,
  daoId: string,
  status: string,
  category: string,
  offset: number,
  limit: number,
  accountId?: string,
  proposer?: string
): Promise<PaginationResponse<ProposalFeedItem[]>> {
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
  };
}

type Props = {
  isMyFeed?: boolean;
  category?: ProposalCategories;
};

export function useProposalsInfinite(props?: Props): SWRInfiniteResponse<{
  data: ProposalFeedItem[];
  total: number;
}> {
  const { isMyFeed, category: initialCategory } = props ?? {};

  const router = useRouter();
  const { query } = router;

  const { accountId } = useWalletContext();

  const limit = LIST_LIMIT_DEFAULT;
  const status = query.status ?? '';
  const category = initialCategory ?? query.category ?? '';
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
    }
  );
}

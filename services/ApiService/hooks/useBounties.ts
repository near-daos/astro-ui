import useSWRInfinite, { SWRInfiniteResponse } from 'swr/infinite';
import useSWR, { SWRResponse } from 'swr';
import axios from 'axios';
import { useRouter } from 'next/router';

import { mapOpenSearchResponseToSearchResult } from 'services/SearchService/mappers/search';
import { SearchResponseIndex } from 'services/SearchService/types';
import { buildBountiesQuery } from 'services/SearchService/builders/bounties';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';

import { appConfig } from 'config';

import { useWalletContext } from 'context/WalletContext';

import { PaginationResponse } from 'types/api';
import { BountyContext } from 'types/bounties';

const DEDUPING_INTERVAL = 10000;

export async function fetcher(
  url: string,
  daoId: string,
  bountySort: string,
  bountyFilter: string,
  bountyPhase: string,
  accountId: string,
  limit: number,
  offset: number
): Promise<PaginationResponse<BountyContext[]>> {
  const sort = bountySort ?? 'createTimestamp,DESC';
  const sortOptions = sort.split(',');
  const baseUrl = process.browser
    ? window.APP_CONFIG.SEARCH_API_URL
    : appConfig.SEARCH_API_URL;

  const response = await axios.post(
    `${baseUrl}/bounty/_search?size=${limit}&from=${offset}`,
    {
      query: buildBountiesQuery({
        daoId,
        account: accountId,
        bountyFilter,
        bountyPhase,
      }),
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
    'bounties',
    SearchResponseIndex.BOUNTY,
    response.data
  );

  return {
    data: mappedData.data as BountyContext[],
    total: mappedData.total,
  };
}

export function useBountiesInfinite(): SWRInfiniteResponse<
  PaginationResponse<BountyContext[]>
> {
  const { accountId } = useWalletContext();
  const { query } = useRouter();
  const { dao, bountySort, bountyFilter, bountyPhase } = query;

  const limit = LIST_LIMIT_DEFAULT;

  return useSWRInfinite(
    index => {
      const offset = index * limit;

      return [
        'bounties',
        dao,
        bountySort,
        bountyFilter,
        bountyPhase,
        accountId,
        limit,
        offset,
      ];
    },
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: DEDUPING_INTERVAL,
    }
  );
}

export function useBounties(
  page: number
): SWRResponse<PaginationResponse<BountyContext[]>> {
  const { accountId } = useWalletContext();
  const { query } = useRouter();
  const { dao, bountySort, bountyFilter, bountyPhase } = query;

  const limit = LIST_LIMIT_DEFAULT;

  return useSWR(
    [
      'bounties',
      dao,
      bountySort,
      bountyFilter,
      bountyPhase,
      accountId,
      limit,
      page * limit,
    ],
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: DEDUPING_INTERVAL,
    }
  );
}

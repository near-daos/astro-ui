import useSWRInfinite, { SWRInfiniteResponse } from 'swr/infinite';
import axios from 'axios';
import { mapOpenSearchResponseToSearchResult } from 'services/SearchService/mappers/search';
import { SearchResponseIndex } from 'services/SearchService/types';
import { useRouter } from 'next/router';
import { appConfig } from 'config';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';
import { useWalletContext } from 'context/WalletContext';
import { PaginationResponse } from 'types/api';
import { BountyContext } from 'types/bounties';
import { buildBountiesQuery } from 'services/SearchService/builders/bounties';

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
  // const sort = 'createTimestamp,DESC';
  // const sortOptions = sort.split(',');
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
        bountySort,
        bountyPhase,
      }),
      // sort: [
      //   {
      //     [sortOptions[0]]: {
      //       order: sortOptions[1].toLowerCase(),
      //     },
      //   },
      // ],
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

export function useBountiesInfinite(): SWRInfiniteResponse<{
  data: BountyContext[];
  total: number;
}> {
  const { accountId } = useWalletContext();
  const { query } = useRouter();
  const { daoId, bountySort, bountyFilter, bountyPhase } = query;

  const limit = LIST_LIMIT_DEFAULT;

  return useSWRInfinite(
    index => {
      const offset = index * limit;

      return [
        'bounties',
        daoId,
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

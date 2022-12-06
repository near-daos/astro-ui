import useSWRInfinite, { SWRInfiniteResponse } from 'swr/infinite';
import { useRouter } from 'next/router';
import axios from 'axios';

import { appConfig } from 'config';
import { SearchResponseIndex } from 'services/SearchService/types';

import { DaoFeedItem } from 'types/dao';
import { PaginationResponse } from 'types/api';

import { mapOpenSearchResponseToSearchResult } from 'services/SearchService/mappers/search';

import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';

/* eslint-disable no-underscore-dangle */
export async function fetcher(
  url: string,
  daosView = 'active',
  limit: number,
  offset: number,
  sort = 'createTimestamp,DESC'
): Promise<PaginationResponse<DaoFeedItem[]>> {
  const sortOptions = sort.split(',');
  const baseUrl = process.browser
    ? window.APP_CONFIG.SEARCH_API_URL
    : appConfig.SEARCH_API_URL;

  const response = await axios.post(
    `${baseUrl}/dao/_search?size=${limit}&from=${offset}`,
    {
      query:
        daosView === 'active'
          ? {
              simple_query_string: {
                query: 'Active',
                fields: ['status'],
              },
            }
          : { match_all: {} },
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
    'daos',
    SearchResponseIndex.DAO,
    response.data
  );

  return {
    data: mappedData.data as DaoFeedItem[],
    total: mappedData.total,
  };
}

export function useDaosInfinite(): SWRInfiniteResponse<
  PaginationResponse<DaoFeedItem[]>
> {
  const { query } = useRouter();
  const limit = LIST_LIMIT_DEFAULT;
  const daosView = query.daosView ?? '';

  return useSWRInfinite(
    index => {
      const offset = index * limit;

      return ['daos', daosView, limit, offset, query.sort];
    },
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 15000,
    }
  );
}

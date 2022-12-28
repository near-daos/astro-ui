import useSWRInfinite, { SWRInfiniteResponse } from 'swr/infinite';
import axios from 'axios';
import { OpenSearchResponse } from 'services/SearchService/types';
import { useRouter } from 'next/router';
import { appConfig } from 'config';
import { PaginationResponse } from 'types/api';
import { SharedProposalTemplate } from 'types/proposalTemplate';

const PROPOSALS_DEDUPING_INTERVAL = 10000;

export async function fetcher(
  url: string,
  offset: number,
  limit: number,
  sort?: string,
  search?: string
): Promise<PaginationResponse<SharedProposalTemplate[]>> {
  const initialSort = sort ?? 'createdAt,DESC';
  const sortOptions = initialSort.split(',');
  const baseUrl = process.browser
    ? window.APP_CONFIG.SEARCH_API_URL
    : appConfig.SEARCH_API_URL;

  const response = await axios.post<unknown, { data: OpenSearchResponse }>(
    `${baseUrl}/search/sharedproposaltemplate?size=${limit}&from=${offset}`,
    {
      query: search
        ? {
            simple_query_string: {
              query: `${search}*`,
              fields: ['name'],
            },
          }
        : {
            match_all: {},
          },
      sort: [
        {
          [sortOptions[0]]: {
            order: sortOptions[1].toLowerCase(),
          },
        },
      ],
    }
  );

  const rawData = response?.data?.hits;

  return {
    data: rawData.hits.map(
      // eslint-disable-next-line no-underscore-dangle
      item => item._source as unknown as SharedProposalTemplate
    ),
    total: rawData.total.value,
  };
}

export function useCfcTemplatesInfinite(): SWRInfiniteResponse<{
  data: SharedProposalTemplate[];
  total: number;
}> {
  const router = useRouter();
  const { query } = router;

  const limit = 40;
  const sort = query.sort ?? 'createdAt,DESC';
  const search = query.search ?? '';

  return useSWRInfinite(
    index => {
      const offset = index * limit;

      return ['sharedProposalTemplates', offset, limit, sort, search];
    },
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: PROPOSALS_DEDUPING_INTERVAL,
    }
  );
}

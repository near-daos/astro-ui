import { useRouter } from 'next/router';
import useSWR from 'swr';
import axios from 'axios';

import { appConfig } from 'config';
import { BountyIndex, OpenSearchResponse } from 'services/SearchService/types';
import { BountyContext } from 'types/bounties';
import { mapBountyIndexToBountyContext } from 'services/SearchService/mappers/bounty';

/* eslint-disable no-underscore-dangle */
export async function fetcher(
  url: string,
  bountyId: string
): Promise<BountyContext | undefined> {
  const baseUrl = process.browser
    ? window.APP_CONFIG.SEARCH_API_URL
    : appConfig.SEARCH_API_URL;

  const response = await axios.post<unknown, { data: OpenSearchResponse }>(
    `${baseUrl}/bounty/_search?size=1&from=0`,
    {
      query: {
        bool: {
          must: [
            {
              simple_query_string: {
                query: `"${bountyId}"`,
                fields: ['id'],
              },
            },
          ] as Record<string, unknown>[],
        },
      },
    }
  );

  const rawData = response?.data?.hits?.hits[0]?._source;

  return rawData
    ? mapBountyIndexToBountyContext(rawData as BountyIndex)
    : undefined;
}

export function useBounty(): {
  data: BountyContext | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const router = useRouter();
  const { query } = router;

  const bountyId = query.bounty ?? '';

  const { data, error } = useSWR(['bounty', bountyId], fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  });

  return {
    data,
    isLoading: !data,
    isError: !!error,
  };
}

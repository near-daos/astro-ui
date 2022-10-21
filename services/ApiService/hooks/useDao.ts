import { useRouter } from 'next/router';
import useSWR, { KeyedMutator } from 'swr';
import axios from 'axios';

import { appConfig } from 'config';
import { DaoIndex, OpenSearchResponse } from 'services/SearchService/types';
import { DAO } from 'types/dao';
import { buildDaoQuery } from 'services/SearchService/builders/dao';
import { mapDaoIndexToDao } from 'services/SearchService/mappers/dao';

/* eslint-disable no-underscore-dangle */
export async function fetcher(url: string, daoId: string): Promise<DAO> {
  const baseUrl = process.browser
    ? window.APP_CONFIG.SEARCH_API_URL
    : appConfig.SEARCH_API_URL;

  const response = await axios.post<unknown, { data: OpenSearchResponse }>(
    `${baseUrl}/dao/_search?size=1&from=0`,
    {
      query: buildDaoQuery(daoId),
    }
  );

  return mapDaoIndexToDao(response.data.hits.hits[0]._source as DaoIndex);
}

export function useDao(): {
  dao: DAO | undefined;
  isLoading: boolean;
  isError: boolean;
  mutate: KeyedMutator<DAO>;
} {
  const router = useRouter();
  const { query } = router;

  const daoId = query.dao ?? '';

  const { data, error, mutate } = useSWR(['dao', daoId], fetcher, {
    revalidateOnFocus: false,
    // revalidateOnMount: false,
    dedupingInterval: 5000,
  });

  return {
    dao: data,
    isLoading: !data,
    isError: !!error,
    mutate,
  };
}

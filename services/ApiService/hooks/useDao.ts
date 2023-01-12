import { useRouter } from 'next/router';
import useSWR, { KeyedMutator } from 'swr';
import axios from 'axios';

import { appConfig } from 'config';
import { DaoIndex, OpenSearchResponse } from 'services/SearchService/types';
import { DAO } from 'types/dao';
import { buildDaoQuery } from 'services/SearchService/builders/dao';
import { mapDaoIndexToDao } from 'services/SearchService/mappers/dao';
import { useFlags } from 'launchdarkly-react-client-sdk';

interface ApiError {
  status?: number;
}

/* eslint-disable no-underscore-dangle */
export async function fetcher(
  url: string,
  daoId: string
): Promise<DAO | undefined> {
  const baseUrl = process.browser
    ? window.APP_CONFIG.SEARCH_API_URL
    : appConfig.SEARCH_API_URL;

  const response = await axios.post<unknown, { data: OpenSearchResponse }>(
    `${baseUrl}/search/dao?size=1&from=0`,
    {
      query: buildDaoQuery(daoId),
    }
  );

  const rawData = response?.data?.hits?.hits[0]?._source;

  if (!rawData) {
    const error = new Error('Empty response') as ApiError;

    error.status = 444;

    throw error;
  }

  return rawData ? mapDaoIndexToDao(rawData as DaoIndex) : undefined;
}

export function useDao(daoId?: string): {
  dao: DAO | undefined;
  isLoading: boolean;
  isError: boolean;
  mutate: KeyedMutator<DAO | undefined>;
} {
  const { useOpenSearchDataApi } = useFlags();
  const router = useRouter();
  const { query } = router;

  const dao = daoId ?? query.dao ?? '';

  const { data, error, mutate, isValidating } = useSWR(
    useOpenSearchDataApi ? ['dao', dao] : undefined,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
      errorRetryCount: 3,
      errorRetryInterval: 3000,
      shouldRetryOnError: err => {
        return err.status !== 404;
      },
    }
  );

  return {
    dao: data,
    isLoading: !data && isValidating,
    isError: !!error,
    mutate,
  };
}

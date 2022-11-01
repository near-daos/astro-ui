import useSWR from 'swr';
import axios from 'axios';

import { appConfig } from 'config';
import { OpenSearchResponse, TokenIndex } from 'services/SearchService/types';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { Token } from 'types/token';
import { buildTokensQuery } from 'services/SearchService/builders/tokens';
import { mapTokenIndexToToken } from 'services/SearchService/mappers/tokens';

/* eslint-disable no-underscore-dangle */
export async function fetcher(
  url: string,
  accountId?: string
): Promise<Token[] | undefined> {
  const baseUrl = process.browser
    ? window.APP_CONFIG.SEARCH_API_URL
    : appConfig.SEARCH_API_URL;

  const response = await axios.post<unknown, { data: OpenSearchResponse }>(
    `${baseUrl}/tokenbalance/_search?size=300&from=0`,
    {
      query: buildTokensQuery(accountId),
    }
  );

  return response?.data?.hits?.hits?.map(item => {
    return mapTokenIndexToToken(item._source as TokenIndex);
  });
}

export function useTokens(accountId?: string): {
  data: Token[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const { useOpenSearchDataApi } = useFlags();

  const { data, error } = useSWR(
    useOpenSearchDataApi ? ['tokenbalance', accountId] : undefined,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    data,
    isLoading: !data,
    isError: !!error,
  };
}

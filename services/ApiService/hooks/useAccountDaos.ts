import useSWR from 'swr';
import axios from 'axios';

import { appConfig } from 'config';
import { DaoIndex, OpenSearchResponse } from 'services/SearchService/types';
import { DaoFeedItem } from 'types/dao';
import { useWalletContext } from 'context/WalletContext';
import { mapDaoIndexToDaoFeedItem } from 'services/SearchService/mappers/search';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { buildAccountDaosQuery } from 'services/SearchService/builders/daos';

/* eslint-disable no-underscore-dangle */
export async function fetcher(
  url: string,
  accountId: string
): Promise<DaoFeedItem[] | undefined> {
  const baseUrl = process.browser
    ? window.APP_CONFIG.SEARCH_API_URL
    : appConfig.SEARCH_API_URL;

  const response = await axios.post<unknown, { data: OpenSearchResponse }>(
    `${baseUrl}/dao/_search?size=100&from=0`,
    {
      query: buildAccountDaosQuery(accountId),
    }
  );

  return response?.data?.hits?.hits?.map(item => {
    return mapDaoIndexToDaoFeedItem(item._source as DaoIndex);
  });
}

export function useAccountDaos(): {
  data: DaoFeedItem[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const { useOpenSearchDataApi } = useFlags();
  const { accountId } = useWalletContext();

  const { data, error } = useSWR(
    useOpenSearchDataApi ? ['accountDaos', accountId] : undefined,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 15000,
    }
  );

  return {
    data,
    isLoading: !data,
    isError: !!error,
  };
}

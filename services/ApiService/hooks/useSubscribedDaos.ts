import useSWR, { KeyedMutator } from 'swr';
import axios from 'axios';

import { appConfig } from 'config';
import { DaoIndex, OpenSearchResponse } from 'services/SearchService/types';
import { DaoFeedItem } from 'types/dao';
import { useWalletContext } from 'context/WalletContext';
import { mapDaoIndexToDaoFeedItem } from 'services/SearchService/mappers/search';
import { useFlags } from 'launchdarkly-react-client-sdk';

/* eslint-disable no-underscore-dangle */
export async function fetcher(
  url: string,
  accountId: string
): Promise<DaoFeedItem[] | undefined> {
  const baseUrl = process.browser
    ? window.APP_CONFIG.SEARCH_API_URL
    : appConfig.SEARCH_API_URL;

  const response = await axios.post<unknown, { data: OpenSearchResponse }>(
    `${baseUrl}/dao/_search?size=200&from=0`,
    {
      query: {
        bool: {
          should: [
            {
              terms: {
                followers: [accountId],
              },
            },
          ],
        },
      },
      sort: [
        {
          createTimestamp: {
            order: 'DESC',
          },
        },
      ],
    }
  );

  return response?.data?.hits?.hits?.map(item => {
    return mapDaoIndexToDaoFeedItem(item._source as DaoIndex, accountId);
  });
}

export function useSubscribedDaos(): {
  data: DaoFeedItem[] | undefined;
  isLoading: boolean;
  isError: boolean;
  mutate: KeyedMutator<DaoFeedItem[] | undefined>;
} {
  const { useOpenSearchDataApi } = useFlags();
  const { accountId } = useWalletContext();

  const { data, error, mutate } = useSWR(
    useOpenSearchDataApi ? ['subscribedDaos', accountId] : undefined,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  return {
    data,
    mutate,
    isLoading: !data,
    isError: !!error,
  };
}

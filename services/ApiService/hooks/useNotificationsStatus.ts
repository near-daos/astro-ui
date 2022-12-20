import axios from 'axios';
import useSWR, { KeyedMutator } from 'swr';
import { appConfig } from 'config';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useWalletContext } from 'context/WalletContext';

/* eslint-disable no-underscore-dangle */
export async function fetcher(url: string, accountId: string): Promise<number> {
  const baseUrl = process.browser
    ? window.APP_CONFIG.SEARCH_API_URL
    : appConfig.SEARCH_API_URL;

  const response = await axios.post(`${baseUrl}/accountnotification/_search`, {
    query: {
      bool: {
        must: [
          {
            simple_query_string: {
              query: `"${accountId}"`,
              fields: ['accountId'],
            },
          },
          {
            simple_query_string: {
              query: false,
              fields: ['isRead'],
            },
          },
        ],
      },
    },
    size: 0,
    track_total_hits: true,
  });

  return response?.data?.hits?.total?.value ?? 0;
}

export function useNotificationsStatus(): {
  count: number;
  mutate: KeyedMutator<number>;
} {
  const { useOpenSearchDataApi } = useFlags();
  const { accountId } = useWalletContext();

  const { data, mutate } = useSWR(
    useOpenSearchDataApi ? ['notificationsStatus', accountId] : undefined,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 30000,
    }
  );

  return {
    count: data ?? 0,
    mutate,
  };
}

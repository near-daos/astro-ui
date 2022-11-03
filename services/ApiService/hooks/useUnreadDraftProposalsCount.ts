import axios from 'axios';
import useSWR from 'swr';
import { appConfig } from 'config';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { buildDraftProposalsQuery } from 'services/SearchService/builders/draftProposals';
import { useWalletContext } from 'context/WalletContext';

const PROPOSALS_DEDUPING_INTERVAL = 10000;

/* eslint-disable no-underscore-dangle */
export async function fetcher(
  url: string,
  daoId: string,
  accountId: string
): Promise<number> {
  const baseUrl = process.browser
    ? window.APP_CONFIG.SEARCH_API_URL
    : appConfig.SEARCH_API_URL;

  const response = await axios.post(`${baseUrl}/draftproposal/_search`, {
    query: buildDraftProposalsQuery(
      {
        daoId,
        state: 'all',
        view: 'unread',
      },
      accountId
    ),
    size: 0,
    track_total_hits: true,
  });

  return response?.data?.hits?.total?.value ?? 0;
}

export function useUnreadDraftProposalsCount(daoId: string): number {
  const { useOpenSearchDataApi } = useFlags();
  const { accountId } = useWalletContext();

  const { data } = useSWR(
    useOpenSearchDataApi
      ? ['unreadDraftProposalsCount', daoId, accountId]
      : undefined,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 30000,
      dedupingInterval: PROPOSALS_DEDUPING_INTERVAL,
    }
  );

  return data ?? 0;
}

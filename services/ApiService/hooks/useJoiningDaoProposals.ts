import axios from 'axios';
import { ProposalCategories, ProposalsFeedStatuses } from 'types/proposal';
import { buildProposalsQuery } from 'services/SearchService/builders/proposals';
import { useRouter } from 'next/router';
import { appConfig } from 'config';
import useSWR from 'swr';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useWalletContext } from 'context/WalletContext';

const PROPOSALS_DEDUPING_INTERVAL = 10000;

export async function fetcher(
  url: string,
  daoId: string,
  accountId: string
): Promise<number> {
  const baseUrl = process.browser
    ? window.APP_CONFIG.SEARCH_API_URL
    : appConfig.SEARCH_API_URL;

  const response = await axios.post(`${baseUrl}/proposal/_search`, {
    query: buildProposalsQuery({
      category: ProposalCategories.Members,
      daoId,
      status: ProposalsFeedStatuses.Active,
      proposers: accountId,
    }),
    size: 0,
    track_total_hits: true,
  });

  return response?.data?.hits?.total?.value ?? 0;
}

export function useJoiningDaoProposals(): boolean {
  const { useOpenSearchDataApi } = useFlags();
  const { accountId } = useWalletContext();
  const router = useRouter();
  const { query } = router;

  const daoId = query.dao ?? '';

  const { data } = useSWR(
    useOpenSearchDataApi
      ? ['joiningDaoProposals', daoId, accountId]
      : undefined,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: PROPOSALS_DEDUPING_INTERVAL,
    }
  );

  return data !== undefined ? data > 0 : false;
}

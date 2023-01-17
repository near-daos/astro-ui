import axios from 'axios';
import useSWR from 'swr';
import { appConfig } from 'config';
import { ProposalsFeedStatuses } from 'types/proposal';
import { buildProposalsQuery } from 'services/SearchService/builders/proposals';
import { useWalletContext } from 'context/WalletContext';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { buildBountiesQuery } from 'services/SearchService/builders/bounties';

const PROPOSALS_DEDUPING_INTERVAL = 10000;

/* eslint-disable no-underscore-dangle */
export async function fetcher(url: string, accountId: string): Promise<number> {
  const baseUrl = process.browser
    ? window.APP_CONFIG.SEARCH_API_URL
    : appConfig.SEARCH_API_URL;

  const response = await axios.post(`${baseUrl}/search/proposal`, {
    query: buildProposalsQuery(
      {
        status: ProposalsFeedStatuses.VoteNeeded,
      },
      accountId
    ),
    size: 0,
    track_total_hits: true,
  });

  const actionableProposals = response?.data?.hits?.total?.value ?? 0;

  const response2 = await axios.post(`${baseUrl}/search/bounty`, {
    query: buildBountiesQuery({
      bountyPhase: 'availableBounty',
    }),
    size: 0,
    track_total_hits: true,
  });

  const actionableBounties = response2?.data?.hits?.total?.value ?? 0;

  return actionableBounties + actionableProposals;
}

export function useAvailableActions(): number {
  const { useOpenSearchDataApi } = useFlags();
  const { accountId } = useWalletContext();

  const { data } = useSWR(
    useOpenSearchDataApi ? ['availableActionsProposals', accountId] : undefined,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 30000,
      dedupingInterval: PROPOSALS_DEDUPING_INTERVAL,
    }
  );

  return data ?? 0;
}

import axios from 'axios';
import useSWR from 'swr';
import { appConfig } from 'config';
import { ProposalFeedItem, ProposalsFeedStatuses } from 'types/proposal';
import { buildProposalsQuery } from 'services/SearchService/builders/proposals';
import { mapOpenSearchResponseToSearchResult } from 'services/SearchService/mappers/search';
import { SearchResponseIndex } from 'services/SearchService/types';
import { useWalletContext } from 'context/WalletContext';
import { useFlags } from 'launchdarkly-react-client-sdk';

const PROPOSALS_DEDUPING_INTERVAL = 10000;

export async function fetcher(
  url: string,
  accountId: string
): Promise<ProposalFeedItem[]> {
  const sort = 'createTimestamp,DESC';
  const sortOptions = sort.split(',');
  const baseUrl = process.browser
    ? window.APP_CONFIG.SEARCH_API_URL
    : appConfig.SEARCH_API_URL;

  const response = await axios.post(
    `${baseUrl}/proposal/_search?size=${100}&from=${0}`,
    {
      query: buildProposalsQuery(
        {
          status: ProposalsFeedStatuses.VoteNeeded,
        },
        accountId
      ),
      sort: [
        {
          [sortOptions[0]]: {
            order: sortOptions[1].toLowerCase(),
          },
        },
      ],
    }
  );

  const mappedData = mapOpenSearchResponseToSearchResult(
    'proposal',
    SearchResponseIndex.PROPOSAL,
    response.data
  );

  return mappedData.data as ProposalFeedItem[];
}

export function useAvailableActionsProposals(): {
  data: ProposalFeedItem[] | undefined;
} {
  const { useOpenSearchDataApi } = useFlags();
  const { accountId } = useWalletContext();

  const { data } = useSWR(
    useOpenSearchDataApi ? ['availableActionsProposals', accountId] : undefined,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: PROPOSALS_DEDUPING_INTERVAL,
    }
  );

  return { data };
}

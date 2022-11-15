import axios from 'axios';
import {
  ProposalFeedItem,
  ProposalCategories,
  ProposalsFeedStatuses,
} from 'types/proposal';
import { buildProposalsQuery } from 'services/SearchService/builders/proposals';
import { mapOpenSearchResponseToSearchResult } from 'services/SearchService/mappers/search';
import { SearchResponseIndex } from 'services/SearchService/types';
import { useRouter } from 'next/router';
import { appConfig } from 'config';
import useSWR from 'swr';
import { useFlags } from 'launchdarkly-react-client-sdk';

const PROPOSALS_DEDUPING_INTERVAL = 10000;

export async function fetcher(
  url: string,
  daoId: string
): Promise<ProposalFeedItem[]> {
  const sort = 'createTimestamp,DESC';
  const sortOptions = sort.split(',');
  const baseUrl = process.browser
    ? window.APP_CONFIG.SEARCH_API_URL
    : appConfig.SEARCH_API_URL;

  const response = await axios.post(
    `${baseUrl}/proposal/_search?size=${50}&from=${0}`,
    {
      query: buildProposalsQuery({
        category: ProposalCategories.Governance,
        daoId,
        status: ProposalsFeedStatuses.Active,
      }),
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

export function usePolicyAffectsProposals(): {
  data: ProposalFeedItem[] | undefined;
} {
  const { useOpenSearchDataApi } = useFlags();
  const router = useRouter();
  const { query } = router;

  const daoId = query.dao ?? '';

  const { data } = useSWR(
    useOpenSearchDataApi ? ['policyAffectsProposals', daoId] : undefined,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: PROPOSALS_DEDUPING_INTERVAL,
    }
  );

  return { data };
}

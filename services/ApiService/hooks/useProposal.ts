import { useRouter } from 'next/router';
import useSWR, { KeyedMutator } from 'swr';
import axios from 'axios';

import { buildProposalQuery } from 'services/SearchService/builders/proposal';

import { ProposalFeedItem } from 'types/proposal';

import { appConfig } from 'config';
import {
  OpenSearchResponse,
  ProposalIndex,
} from 'services/SearchService/types';
import { mapProposalIndexToProposalFeedItem } from 'services/SearchService/mappers/search';
import { useFlags } from 'launchdarkly-react-client-sdk';

/* eslint-disable no-underscore-dangle */
export async function fetcher(
  url: string,
  daoId: string,
  proposalId: string
): Promise<ProposalFeedItem | undefined> {
  const baseUrl = process.browser
    ? window.APP_CONFIG.SEARCH_API_URL
    : appConfig.SEARCH_API_URL;

  const response = await axios.post<unknown, { data: OpenSearchResponse }>(
    `${baseUrl}/proposal/_search?size=1&from=0`,
    {
      query: buildProposalQuery({
        daoId,
        proposalId,
      }),
    }
  );

  const rawData = response?.data?.hits?.hits[0]?._source;

  return rawData
    ? mapProposalIndexToProposalFeedItem(rawData as ProposalIndex)
    : undefined;
}

export function useProposal(): {
  proposal: ProposalFeedItem | undefined;
  isLoading: boolean;
  isError: boolean;
  mutate: KeyedMutator<ProposalFeedItem | undefined>;
} {
  const { useOpenSearchDataApi } = useFlags();
  const router = useRouter();
  const { query } = router;

  const daoId = query.dao ?? '';
  const proposalId = query.proposal ?? '';

  const { data, error, mutate } = useSWR(
    useOpenSearchDataApi ? ['proposal', daoId, proposalId] : undefined,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnMount: false,
      dedupingInterval: 5000,
    }
  );

  return {
    proposal: data,
    isLoading: !data,
    isError: !!error,
    mutate,
  };
}

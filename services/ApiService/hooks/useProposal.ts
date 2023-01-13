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

interface ApiError {
  status?: number;
}

/* eslint-disable no-underscore-dangle */
export async function fetcher(
  url: string,
  daoId: string,
  proposalId: string
): Promise<ProposalFeedItem | null> {
  const baseUrl = process.browser
    ? window.APP_CONFIG.SEARCH_API_URL
    : appConfig.SEARCH_API_URL;

  const response = await axios.post<unknown, { data: OpenSearchResponse }>(
    `${baseUrl}/search/proposal?size=1&from=0`,
    {
      query: buildProposalQuery({
        daoId,
        proposalId,
      }),
    }
  );

  const rawData = response?.data?.hits?.hits[0]?._source;

  if (!rawData && process.browser) {
    const error = new Error('Empty response') as ApiError;

    error.status = 444;

    throw error;
  }

  return rawData
    ? mapProposalIndexToProposalFeedItem(rawData as ProposalIndex)
    : null;
}

export function useProposal(): {
  proposal: ProposalFeedItem | undefined;
  isLoading: boolean;
  isError: boolean;
  mutate: KeyedMutator<ProposalFeedItem | null>;
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
      errorRetryCount: 3,
      errorRetryInterval: 3000,
      shouldRetryOnError: err => {
        return err.status !== 404;
      },
    }
  );

  return {
    proposal: data ?? undefined,
    isLoading: !data,
    isError: !!error,
    mutate,
  };
}

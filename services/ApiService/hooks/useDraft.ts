import useSWR, { KeyedMutator } from 'swr';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useRouter } from 'next/router';

import { DraftProposal } from 'types/draftProposal';
import { appConfig } from 'config';
import axios from 'axios';
import {
  DraftProposalIndex,
  OpenSearchResponse,
} from 'services/SearchService/types';
import { buildDraftQuery } from 'services/SearchService/builders/draft';
import { mapDraftProposalIndexToDraftProposal } from 'services/SearchService/mappers/draft';
import { useWalletContext } from 'context/WalletContext';

/* eslint-disable no-underscore-dangle */
export async function fetcher(
  url: string,
  daoId: string,
  draftId: string,
  accountId?: string
): Promise<DraftProposal | undefined> {
  const baseUrl = process.browser
    ? window.APP_CONFIG.SEARCH_API_URL
    : appConfig.SEARCH_API_URL;

  const response = await axios.post<unknown, { data: OpenSearchResponse }>(
    `${baseUrl}/draftproposal/_search?size=1&from=0`,
    {
      query: buildDraftQuery({
        daoId,
        draftId,
      }),
    }
  );

  const rawData = response?.data?.hits?.hits[0]?._source;

  return mapDraftProposalIndexToDraftProposal(
    rawData as DraftProposalIndex,
    accountId
  );
}

export function useDraft(): {
  data: DraftProposal | undefined;
  isLoading: boolean;
  isError: boolean;
  mutate: KeyedMutator<DraftProposal | undefined>;
} {
  const { accountId } = useWalletContext();
  const { useOpenSearchDataApi } = useFlags();
  const router = useRouter();
  const { query } = router;

  const daoId = query.dao ?? '';
  const draftId = query.draft ?? '';

  const { data, error, mutate } = useSWR(
    useOpenSearchDataApi ? ['draft', daoId, draftId, accountId] : undefined,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  return {
    data,
    isLoading: !data,
    isError: !!error,
    mutate,
  };
}

import { useRouter } from 'next/router';
import useSWR, { KeyedMutator } from 'swr';
import axios from 'axios';

import { appConfig } from 'config';
import {
  OpenSearchResponse,
  ProposalTemplateIndex,
  SharedProposalTemplateIndex,
} from 'services/SearchService/types';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { SharedProposalTemplate } from 'types/proposalTemplate';
import { mapSharedProposalTemplateIndexToSharedProposalTemplate } from 'services/SearchService/mappers/sharedProposalTemplate';

/* eslint-disable no-underscore-dangle */
export async function fetcher(
  url: string,
  templateId: string
): Promise<SharedProposalTemplate | undefined> {
  const baseUrl = process.browser
    ? window.APP_CONFIG.SEARCH_API_URL
    : appConfig.SEARCH_API_URL;

  const response = await axios.post<unknown, { data: OpenSearchResponse }>(
    `${baseUrl}/search/sharedproposaltemplate?size=1&from=0`,
    {
      query: {
        simple_query_string: {
          query: templateId,
          fields: ['id'],
        },
      },
    }
  );

  const response2 = await axios.post<unknown, { data: OpenSearchResponse }>(
    `${baseUrl}/search/proposaltemplate`,
    {
      query: {
        simple_query_string: {
          query: templateId,
          fields: ['sourceTemplateId'],
        },
      },
    }
  );
  const rawDaosWithThisTemplate = response2?.data?.hits?.hits.map(
    item => (item._source as ProposalTemplateIndex).daoId
  );

  const rawData = response?.data?.hits?.hits[0]?._source;

  return rawData
    ? mapSharedProposalTemplateIndexToSharedProposalTemplate(
        rawData as SharedProposalTemplateIndex,
        rawDaosWithThisTemplate
      )
    : undefined;
}

export function useSharedProposalTemplate(): {
  data: SharedProposalTemplate | undefined;
  isLoading: boolean;
  isError: boolean;
  mutate: KeyedMutator<SharedProposalTemplate | undefined>;
} {
  const { useOpenSearchDataApi } = useFlags();
  const router = useRouter();
  const { query } = router;

  const templateId = query.template ?? '';

  const { data, error, mutate } = useSWR(
    useOpenSearchDataApi ? ['sharedProposalTemplate', templateId] : undefined,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    data,
    isLoading: !data,
    isError: !!error,
    mutate,
  };
}

import { useRouter } from 'next/router';
import useSWR, { KeyedMutator } from 'swr';
import axios from 'axios';

import { appConfig } from 'config';
import {
  OpenSearchResponse,
  ProposalTemplateIndex,
} from 'services/SearchService/types';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { ProposalTemplate } from 'types/proposalTemplate';
import { mapProposalTemplateIndexToProposalTemplate } from 'services/SearchService/mappers/proposalTemplate';

/* eslint-disable no-underscore-dangle */
export async function fetcher(
  url: string,
  daoId: string
): Promise<ProposalTemplate[] | undefined> {
  const baseUrl = process.browser
    ? window.APP_CONFIG.SEARCH_API_URL
    : appConfig.SEARCH_API_URL;

  const response = await axios.post<unknown, { data: OpenSearchResponse }>(
    `${baseUrl}/search/proposaltemplate`,
    {
      query: {
        bool: {
          must: [
            {
              simple_query_string: {
                query: `"${daoId}"`,
                fields: ['daoId'],
              },
            },
            {
              simple_query_string: {
                query: false,
                fields: ['isArchived'],
              },
            },
          ],
        },
      },
      sort: [
        {
          createdAt: {
            order: 'DESC',
          },
        },
      ],
    }
  );

  const rawData = response?.data?.hits?.hits;

  return rawData
    ? rawData.map(item =>
        mapProposalTemplateIndexToProposalTemplate(
          item._source as ProposalTemplateIndex
        )
      )
    : undefined;
}

export function useDaoProposalTemplates(daoId?: string): {
  data: ProposalTemplate[] | undefined;
  isLoading: boolean;
  isError: boolean;
  mutate: KeyedMutator<ProposalTemplate[] | undefined>;
} {
  const { useOpenSearchDataApi } = useFlags();
  const router = useRouter();
  const { query } = router;

  const dao = daoId ?? query.dao ?? '';

  const { data, error, mutate } = useSWR(
    useOpenSearchDataApi ? ['daoProposalTemplates', dao] : undefined,
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

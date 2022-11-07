import useSWR from 'swr';
import axios from 'axios';
import { useRouter } from 'next/router';
import { appConfig } from 'config';

import { DraftComment } from 'services/DraftsService/types';
import { SearchResponseIndex } from 'services/SearchService/types';

import { mapOpenSearchResponseToSearchResult } from 'services/SearchService/mappers/search';

import { buildDraftProposalCommentsQuery } from 'services/SearchService/builders/draftProposalComments';

export async function fetcher(
  url: string,
  daoId: string,
  draftId: string
): Promise<DraftComment[]> {
  const baseUrl = process.browser
    ? window.APP_CONFIG.SEARCH_API_URL
    : appConfig.SEARCH_API_URL;

  const response = await axios.post(
    `${baseUrl}/draftproposalcomment/_search?size=1000&from=0`,
    {
      query: buildDraftProposalCommentsQuery({
        daoId,
        draftId,
      }),
      sort: [
        {
          createTimestamp: {
            order: 'desc',
          },
        },
      ],
    }
  );

  const mappedData = mapOpenSearchResponseToSearchResult(
    'draftProposalComment',
    SearchResponseIndex.DRAFT_PROPOSAL_COMMENT,
    response.data
  );

  return mappedData.data as DraftComment[];
}

export function useDraftProposalComments(): {
  data: DraftComment[];
} {
  const router = useRouter();
  const { query } = router;

  const daoId = query.dao ?? '';
  const draftId = query.draft ?? '';

  const { data } = useSWR(['draftProposalComment', daoId, draftId], fetcher, {
    revalidateOnFocus: false,
  });

  return { data: data ?? [] };
}

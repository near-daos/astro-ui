import useSWRInfinite, { SWRInfiniteResponse } from 'swr/infinite';
import axios from 'axios';
import { useRouter } from 'next/router';
import { appConfig } from 'config';

import { ProposalCategories } from 'types/proposal';
import { PaginationResponse } from 'types/api';
import { DraftProposalFeedItem } from 'types/draftProposal';
import { DraftState } from 'services/DraftsService/types';

import { buildDraftProposalsQuery } from 'services/SearchService/builders/draftProposals';
import { mapOpenSearchResponseToSearchResult } from 'services/SearchService/mappers/search';
import { SearchResponseIndex } from 'services/SearchService/types';
import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';

const PROPOSALS_DEDUPING_INTERVAL = 10000;

export async function fetcher(
  url: string,
  daoId: string,
  state: string,
  category: string,
  offset: string,
  limit: string,
  accountId: string,
  sort: string,
  view: string,
  search: string
): Promise<PaginationResponse<DraftProposalFeedItem[]>> {
  const sortOptions = sort.split(',');
  const baseUrl = process.browser
    ? window.APP_CONFIG.SEARCH_API_URL
    : appConfig.SEARCH_API_URL;

  const response = await axios.post(
    `${baseUrl}/draftproposal/_search?size=${limit}&from=${offset}`,
    {
      query: buildDraftProposalsQuery(
        {
          category: category as ProposalCategories,
          daoId,
          state: state as DraftState,
          view,
          search,
        },
        accountId
      ),
      // todo - waiting until this will be implemented in lambda
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
    'draftProposal',
    SearchResponseIndex.DRAFT_PROPOSAL,
    response.data
  );

  return {
    data: mappedData.data as DraftProposalFeedItem[],
    total: mappedData.total,
  };
}

export function useDraftProposalsInfinite(): SWRInfiniteResponse<{
  data: DraftProposalFeedItem[];
  total: number;
}> {
  const router = useRouter();
  const { query } = router;

  const accountId = '';

  const limit = LIST_LIMIT_DEFAULT;
  const state = query.state ?? '';
  const category = query.category ?? '';
  const daoId = query.dao ?? '';
  const sort = query.sort ?? 'createTimestamp,DESC';
  const search = query.search ?? '';
  const view = query.view ?? '';

  return useSWRInfinite(
    index => {
      const offset = index * limit;

      return [
        'draftProposals',
        daoId,
        state,
        category,
        offset,
        limit,
        accountId,
        sort,
        view,
        search,
      ];
    },
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: PROPOSALS_DEDUPING_INTERVAL,
    }
  );
}

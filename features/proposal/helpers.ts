import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';
import { SputnikHttpService } from 'services/sputnik';
import {
  ProposalCategories,
  ProposalFeedItem,
  ProposalsFeedStatuses,
} from 'types/proposal';
import { PaginationResponse } from 'types/api';
import { OpenSearchApiService } from 'services/SearchService';

export async function getProposalsList(
  initialData: PaginationResponse<ProposalFeedItem[]> | null,
  status: ProposalsFeedStatuses,
  category: ProposalCategories | undefined,
  accountId: string,
  daoId: string,
  isMyFeed: boolean,
  useOpenSearchDataApi: boolean,
  openSearchService: OpenSearchApiService | null,
  proposers?: string
): Promise<PaginationResponse<ProposalFeedItem[]> | null> {
  const params = {
    offset: initialData?.data.length || 0,
    limit: LIST_LIMIT_DEFAULT,
    daoId: '',
    category,
    status,
    accountId,
    proposers,
  };

  let res;

  if (daoId) {
    params.daoId = daoId;

    res =
      useOpenSearchDataApi && openSearchService
        ? await openSearchService?.getProposalsList(params)
        : await SputnikHttpService.getProposalsList(params);
  } else if (isMyFeed && accountId) {
    res =
      useOpenSearchDataApi && openSearchService
        ? await openSearchService?.getProposalsList(params, accountId)
        : await SputnikHttpService.getProposalsListByAccountId(
            params,
            accountId
          );
  } else {
    res =
      useOpenSearchDataApi && openSearchService
        ? await openSearchService?.getProposalsList(params)
        : await SputnikHttpService.getProposalsList(params);
  }

  return res;
}

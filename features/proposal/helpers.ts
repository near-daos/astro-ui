import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';
import { SputnikHttpService } from 'services/sputnik';
import {
  ProposalCategories,
  ProposalFeedItem,
  ProposalsFeedStatuses,
} from 'types/proposal';
import { PaginationResponse } from 'types/api';

export async function getProposalsList(
  initialData: PaginationResponse<ProposalFeedItem[]> | null,
  status: ProposalsFeedStatuses,
  category: ProposalCategories | undefined,
  accountId: string,
  daoId: string,
  isMyFeed: boolean,
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

    res = await SputnikHttpService.getProposalsList(params);
  } else if (isMyFeed && accountId) {
    res = await SputnikHttpService.getProposalsListByAccountId(
      params,
      accountId
    );
  } else {
    res = await SputnikHttpService.getProposalsList(params);
  }

  return res;
}

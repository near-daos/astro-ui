import { ProposalsFeedStatuses } from 'types/proposal';

import { getStatusFilterOptions } from 'astro_2.0/features/Proposals/helpers/getStatusFilterOptions';

describe('getStatusFilterOptions', () => {
  const t = (label: string) => label;

  it('Should not add "Vote Needed" status', () => {
    const result = getStatusFilterOptions(false, t);

    expect(result).toEqual([
      { value: 'all', label: 'feed.filters.all' },
      { value: 'active', label: 'feed.filters.active' },
      {
        value: 'approved',
        label: 'feed.filters.approved',
        className: 'categoriesListApprovedInputWrapperChecked',
      },
      {
        value: 'failed',
        label: 'feed.filters.failed',
        className: 'categoriesListFailedInputWrapperChecked',
      },
    ]);
  });

  it('Should add "Vote Needed" status', () => {
    const result = getStatusFilterOptions(true, t);

    expect(result).toEqual([
      { value: 'all', label: 'feed.filters.all' },
      { value: 'active', label: 'feed.filters.active' },
      {
        value: ProposalsFeedStatuses.VoteNeeded,
        label: t('feed.filters.voteNeeded'),
      },
      {
        value: 'approved',
        label: 'feed.filters.approved',
        className: 'categoriesListApprovedInputWrapperChecked',
      },
      {
        value: 'failed',
        label: 'feed.filters.failed',
        className: 'categoriesListFailedInputWrapperChecked',
      },
    ]);
  });
});

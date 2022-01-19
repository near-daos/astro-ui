import { BountyStatus } from 'types/bounties';

export const BOUNTIES_PAGE_SORT_OPTIONS = [
  {
    label: 'Newest',
    value: 'createdAt,DESC',
  },
  {
    label: 'Oldest',
    value: 'createdAt,ASC',
  },
];

export const BOUNTIES_PAGE_FILTER_OPTIONS = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Available bounties',
    value: BountyStatus.Available,
  },
  {
    label: 'Claims in progress',
    value: BountyStatus.InProgress,
  },
  {
    label: 'Expired Claims',
    value: BountyStatus.Expired,
  },
];

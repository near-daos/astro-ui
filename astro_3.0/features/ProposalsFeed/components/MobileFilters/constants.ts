import { FEED_CATEGORIES } from 'constants/proposals';

export const CATEGORIES = [
  {
    value: 'All',
    label: 'All',
  },
  ...FEED_CATEGORIES,
];

export const TYPES = [
  {
    value: 'All',
    label: 'All',
  },
  {
    value: 'Unread',
    label: 'Unread',
  },
  {
    value: 'Saved',
    label: 'Saved',
  },
];

export const SORT = [
  {
    label: 'Newest',
    value: 'createdAt,DESC',
  },
  {
    label: 'Oldest',
    value: 'createdAt,ASC',
  },
];

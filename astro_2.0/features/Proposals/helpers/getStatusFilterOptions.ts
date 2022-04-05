import { ProposalsFeedStatuses } from 'types/proposal';
import styles from 'astro_2.0/features/Feed/Feed.module.scss';
import { TFunction } from 'next-i18next';
import React from 'react';

export function getStatusFilterOptions(
  showVoteNeeded: boolean,
  t: TFunction
): {
  label: React.ReactNode;
  value: string;
  className?: string;
}[] {
  const initialList = [
    {
      value: ProposalsFeedStatuses.All,
      label: t('feed.filters.all'),
    },
    {
      value: ProposalsFeedStatuses.Active,
      label: t('feed.filters.active'),
    },
  ];

  if (showVoteNeeded) {
    initialList.push({
      value: ProposalsFeedStatuses.VoteNeeded,
      label: t('feed.filters.voteNeeded'),
    });
  }

  return [
    ...initialList,
    {
      value: ProposalsFeedStatuses.Approved,
      label: t('feed.filters.approved'),
      className: styles.categoriesListApprovedInputWrapperChecked,
    },
    {
      value: ProposalsFeedStatuses.Failed,
      label: t('feed.filters.failed'),
      className: styles.categoriesListFailedInputWrapperChecked,
    },
  ];
}

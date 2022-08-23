import React, { FC, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { ProposalsFeedStatuses } from 'types/proposal';

import {
  CategoriesFeedFilter,
  ListItem,
} from 'astro_3.0/features/ProposalsFeed/components/CategoriesFeedFilter';
import { IconName } from 'components/Icon';

interface Props {
  className?: string;
}

export const StatusFeedFilter: FC<Props> = ({ className }) => {
  const router = useRouter();

  const { t } = useTranslation();
  const { pathname } = router;

  const isMyFeed = pathname.startsWith('/my');

  const options = useMemo<ListItem[]>(() => {
    const initialList = [
      {
        value: ProposalsFeedStatuses.Active,
        label: t('feed.filters.active'),
        icon: 'filterClock' as IconName,
      },
    ];

    if (isMyFeed) {
      initialList.push({
        value: ProposalsFeedStatuses.VoteNeeded,
        label: t('feed.filters.vote'),
        icon: 'filterClock' as IconName,
      });
    }

    return [
      ...initialList,
      {
        value: ProposalsFeedStatuses.Approved,
        label: t('feed.filters.approved'),
        icon: 'filterCheck' as IconName,
      },
      {
        value: ProposalsFeedStatuses.Failed,
        label: t('feed.filters.failed'),
        icon: 'filterClose' as IconName,
      },
    ];
  }, [isMyFeed, t]);

  return (
    <CategoriesFeedFilter
      hideAllOption
      list={options}
      disabled={false}
      className={className}
    />
  );
};

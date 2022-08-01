import React, { FC, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import useQuery from 'hooks/useQuery';
import { Dropdown } from 'components/Dropdown';
import { ProposalsFeedStatuses } from 'types/proposal';

import { CookieService } from 'services/CookieService';
import { FEED_STATUS_COOKIE } from 'constants/cookies';

import styles from './StatusFeedFilter.module.scss';

export const StatusFeedFilter: FC = () => {
  const router = useRouter();

  const { t } = useTranslation();
  const { query } = useQuery<{ status: string }>();
  const { status } = query;
  const { pathname } = router;

  const isMyFeed = pathname.startsWith('/my');

  const options = useMemo(() => {
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

    if (isMyFeed) {
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
      },
      {
        value: ProposalsFeedStatuses.Failed,
        label: t('feed.filters.failed'),
      },
    ];
  }, [isMyFeed, t]);

  const handleChange = useCallback(
    async value => {
      const nextQuery = {
        ...query,
        status: value,
      };

      CookieService.set(
        FEED_STATUS_COOKIE,
        Object.values(ProposalsFeedStatuses).includes(
          value as ProposalsFeedStatuses
        )
          ? value
          : ProposalsFeedStatuses.All,
        { path: '/' }
      );

      await router.replace(
        {
          query: nextQuery,
        },
        undefined,
        { shallow: true, scroll: false }
      );
    },
    [query, router]
  );

  return (
    <div className={styles.root}>
      <Dropdown
        disabled={false}
        className={styles.dropdownWrapper}
        controlIconClassName={styles.controlIcon}
        controlIcon="listFilter"
        controlClassName={styles.dropdown}
        menuClassName={styles.menu}
        options={options}
        value={status ?? options[0].value}
        defaultValue={status ?? options[0].value}
        onChange={handleChange}
      />
    </div>
  );
};

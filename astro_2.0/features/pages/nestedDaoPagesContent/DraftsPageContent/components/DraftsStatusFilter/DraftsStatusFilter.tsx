import React, { FC, useCallback, useMemo } from 'react';
import useQuery from 'hooks/useQuery';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { Dropdown } from 'components/Dropdown';

import styles from './DraftsStatusFilter.module.scss';

export const DraftsStatusFilter: FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { query } = useQuery<{ state: string }>();
  const { state } = query;

  const options = useMemo(
    () => [
      {
        value: 'all',
        label: t('drafts.feed.filters.state.all'),
      },
      {
        value: 'open',
        label: t('drafts.feed.filters.state.onDiscussionStatus'),
      },
      {
        value: 'closed',
        label: t('drafts.feed.filters.state.convertedToProposalStatus'),
      },
    ],
    [t]
  );

  const handleChange = useCallback(
    async value => {
      const nextQuery = {
        ...query,
        state: value,
      };

      await router.replace(
        {
          query: nextQuery,
        },
        undefined,
        { shallow: false, scroll: false }
      );
    },
    [query, router]
  );

  return (
    <div className={styles.root}>
      <Dropdown
        disabled={false}
        selectedClassName={styles.selectedClassName}
        className={styles.dropdownWrapper}
        controlIcon="listFilter"
        controlIconClassName={styles.controlIcon}
        controlClassName={styles.dropdown}
        menuClassName={styles.menu}
        options={options}
        value={state ?? options[1].value}
        defaultValue={state ?? options[1].value}
        onChange={handleChange}
      />
    </div>
  );
};

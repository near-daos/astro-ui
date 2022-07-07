import React, { FC, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { TFunction, useTranslation } from 'next-i18next';

import useQuery from 'hooks/useQuery';
import { Dropdown } from 'components/Dropdown';
import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import { useModal } from 'components/modal';
import { FiltersModal } from 'astro_2.0/features/pages/nestedDaoPagesContent/DraftsPageContent/components/FiltersModal';

import styles from './DraftMobileFilters.module.scss';

function getSortOptions(t: TFunction) {
  return [
    {
      label: t('allDAOsFilter.newest'),
      value: 'updatedAt,DESC',
    },
    {
      label: t('allDAOsFilter.oldest'),
      value: 'updatedAt,ASC',
    },
  ];
}

export const DraftMobileFilters: FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const sortOptions = useMemo(() => getSortOptions(t), [t]);
  const { query } = useQuery<{ sort: string; view: string }>();
  const { sort } = query;
  const [showModal] = useModal(FiltersModal, {});

  const handleSort = useCallback(
    async value => {
      const nextQuery = {
        ...query,
        sort: value,
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
    <div className={styles.draftMobileFilters}>
      <Dropdown
        className={styles.sorting}
        options={sortOptions}
        value={sort ?? sortOptions[0].value}
        defaultValue={sort ?? sortOptions[0].value}
        onChange={handleSort}
        menuClassName={styles.menu}
      />
      <Button
        onClick={() => showModal()}
        className={styles.filters}
        capitalize
        variant="transparent"
      >
        Filters <Icon className={styles.icon} name="listFilter" />
      </Button>
    </div>
  );
};

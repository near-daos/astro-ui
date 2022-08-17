import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';

import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import { useModal } from 'components/modal';
import { DraftsFiltersModal } from 'astro_2.0/features/pages/nestedDaoPagesContent/DraftsPageContent/components/DraftsFiltersModal';

import styles from './DraftsMobileFilters.module.scss';

export const DraftsMobileFilters: FC = () => {
  const { t } = useTranslation();
  const [showModal] = useModal(DraftsFiltersModal, {});

  return (
    <div className={styles.draftMobileFilters}>
      <Button
        onClick={() => showModal()}
        className={styles.filters}
        capitalize
        variant="transparent"
      >
        {t('drafts.feed.filters.title')}{' '}
        <Icon className={styles.icon} name="listFilter" />
      </Button>
    </div>
  );
};

import React, { FC, useMemo } from 'react';
import { useTranslation } from 'next-i18next';

import { Modal } from 'components/modal';

import { FEED_CATEGORIES } from 'constants/proposals';
import { Filter } from './Filter';

import styles from './DraftsFiltersModal.module.scss';

type FiltersModalProps = {
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
};

export const DraftsFiltersModal: FC<FiltersModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();

  const categoryOptions = useMemo(
    () =>
      [
        { label: t('drafts.feed.filters.category.all'), value: 'all-category' },
        ...FEED_CATEGORIES,
      ].map(item => ({
        ...item,
        label: t(item.label.toLowerCase()),
      })),
    [t]
  );

  const typeOptions = useMemo(() => {
    return [
      {
        label: t('drafts.feed.filters.view.all'),
        value: 'all-view',
      },
      {
        label: t('drafts.feed.filters.view.unread'),
        value: 'unread',
      },
      {
        label: t('drafts.feed.filters.view.saved'),
        value: 'read',
      },
    ];
  }, [t]);

  const stateOptions = useMemo(() => {
    return [
      {
        label: t('drafts.feed.filters.state.all'),
        value: 'all-state',
      },
      {
        label: t('drafts.feed.filters.state.onDiscussionStatus'),
        value: 'open',
      },
      {
        label: t('drafts.feed.filters.state.convertedToProposalStatus'),
        value: 'close',
      },
    ];
  }, [t]);

  const sortOptions = useMemo(() => {
    return [
      {
        label: t('allDAOsFilter.newest'),
        value: 'createdAt,DESC',
      },
      {
        label: t('allDAOsFilter.oldest'),
        value: 'createdAt,ASC',
      },
    ];
  }, [t]);

  return (
    <Modal
      className={styles.modal}
      isOpen={isOpen}
      onClose={onClose}
      overlayClassName={styles.overlay}
      size="lg"
    >
      <div className={styles.title}>{t('drafts.feed.filters.title')}</div>
      <Filter
        options={categoryOptions}
        title={t('drafts.feed.filters.category.title')}
        queryName="category"
      />
      <Filter
        options={typeOptions}
        title={t('drafts.feed.filters.view.title')}
        queryName="view"
      />
      <Filter
        options={stateOptions}
        title={t('drafts.feed.filters.state.title')}
        queryName="state"
      />
      <Filter
        options={sortOptions}
        title={t('drafts.feed.filters.sort.title')}
        queryName="sort"
      />
    </Modal>
  );
};

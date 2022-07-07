import React, { FC, useMemo } from 'react';
import { useTranslation } from 'next-i18next';

import { Modal } from 'components/modal';

import { FEED_CATEGORIES } from 'constants/proposals';
import { Filter } from './Filter';

import styles from './FiltersModal.module.scss';

type FiltersModalProps = {
  isOpen: boolean;
  onClose: (...args: unknown[]) => void;
};

function getTypeOptions() {
  return [
    {
      label: 'All',
      value: 'all-view',
    },
    {
      label: 'Unread',
      value: 'unread',
    },
    {
      label: 'Read',
      value: 'read',
    },
  ];
}

function getStateOptions() {
  return [
    {
      label: 'All',
      value: 'all-state',
    },
    {
      label: 'Open',
      value: 'open',
    },
    {
      label: 'Close',
      value: 'close',
    },
  ];
}

export const FiltersModal: FC<FiltersModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  const categoryOptions = useMemo(
    () =>
      [{ label: 'All', value: 'all-category' }, ...FEED_CATEGORIES].map(
        item => ({
          ...item,
          label: t(item.label.toLowerCase()),
        })
      ),
    [t]
  );

  const typeOptions = useMemo(() => getTypeOptions(), []);
  const stateOptions = useMemo(() => getStateOptions(), []);

  return (
    <Modal
      className={styles.modal}
      isOpen={isOpen}
      onClose={onClose}
      overlayClassName={styles.overlay}
      size="lg"
    >
      <div className={styles.title}>Filters</div>
      <Filter options={categoryOptions} title="Category" queryName="category" />
      <Filter options={typeOptions} title="Type" queryName="view" />
      <Filter options={stateOptions} title="Accessibility" queryName="state" />
    </Modal>
  );
};

import React, { FC } from 'react';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';

import { SearchInput } from 'astro_2.0/components/SearchInput';

import { PaginationResponse } from 'types/api';

import styles from './DraftsPageHeader.module.scss';

interface Props {
  className?: string;
  onSearch: (val: string) => Promise<PaginationResponse<unknown[]> | null>;
  loading: boolean;
  handleReset: () => void;
}

export const DraftsPageHeader: FC<Props> = ({
  className,
  onSearch,
  loading,
  handleReset,
}) => {
  const { t } = useTranslation();

  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.title}>{t('drafts.feed.title')}</div>
      <SearchInput
        inputClassName={styles.searchInput}
        iconClassName={styles.searchIcon}
        removeButtonClassName={styles.removeButton}
        removeIconClassName={styles.removeIcon}
        className={styles.search}
        onSubmit={onSearch}
        loading={loading}
        placeholder="Search by name"
        onClose={handleReset}
        showResults={false}
      />
    </div>
  );
};

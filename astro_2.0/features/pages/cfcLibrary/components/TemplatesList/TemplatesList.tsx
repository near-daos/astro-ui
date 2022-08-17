import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';

import InfiniteScroll from 'react-infinite-scroll-component';
import { LoadingIndicator } from 'astro_2.0/components/LoadingIndicator';
import { TemplatesListItem } from 'astro_2.0/features/pages/cfcLibrary/components/TemplatesList/components/TemplatesListItem';

import { SharedProposalTemplate } from 'types/proposalTemplate';

import styles from './TemplatesList.module.scss';

interface Props {
  total: number;
  data: SharedProposalTemplate[] | null;
  next: () => void;
}

export const TemplatesList: FC<Props> = ({ total, data, next }) => {
  const { t } = useTranslation();

  if (!data) {
    return null;
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.name}>{t('actions.name')}</div>
        <div className={cn(styles.creator, styles.hideMobile)}>
          {t('actions.smartContractAddress')}
        </div>
        <div className={cn(styles.duplicated, styles.hideMobile)}>
          {t('actions.usedNumberDaos')}
        </div>
        <div className={styles.control}>&nbsp;</div>
      </div>
      <InfiniteScroll
        dataLength={data.length}
        next={next}
        hasMore={data.length < total}
        loader={
          <div className={styles.loadingMore}>
            <LoadingIndicator />
          </div>
        }
        style={{ overflow: 'initial' }}
        endMessage=""
      >
        {data.map(item => (
          <TemplatesListItem data={item} key={item.id} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

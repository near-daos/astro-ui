import { FC } from 'react';
import cn from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { useTranslation } from 'next-i18next';

import { DaoFeedItem, Member } from 'types/dao';
import { ProposalFeedItem } from 'types/proposal';

import styles from './ResultSection.module.scss';

interface ResultSectionProps {
  title: string;
  data: DaoFeedItem[] | ProposalFeedItem[] | Member[] | undefined;
  onSeeAll: () => void;
  contentClassName?: string;
}

export const ResultSection: FC<ResultSectionProps> = props => {
  const { title, data, onSeeAll, children, contentClassName } = props;

  const { t } = useTranslation('common');

  if (isEmpty(data)) {
    return null;
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div>{title}</div>
        <div
          tabIndex={0}
          role="button"
          className={styles.link}
          onClick={onSeeAll}
          onKeyPress={onSeeAll}
        >
          {t('header.search.seeAll')} ({data?.length})
        </div>
      </div>
      <div className={cn(styles.content, contentClassName)}>{children}</div>
    </div>
  );
};

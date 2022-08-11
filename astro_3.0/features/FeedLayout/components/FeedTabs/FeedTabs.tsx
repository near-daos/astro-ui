import React, { FC } from 'react';
import Link from 'next/link';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import { ALL_FEED_URL, MY_FEED_URL } from 'constants/routing';

import { useAvailableActionsCounters } from 'hooks/useAvailableActionsCounters';
import { useWalletContext } from 'context/WalletContext';

import { kFormatter } from 'utils/format';

import styles from './FeedTabs.module.scss';

export const FeedTabs: FC = () => {
  const { t } = useTranslation();
  const { accountId } = useWalletContext();
  const router = useRouter();

  const { proposalActionsCount } = useAvailableActionsCounters();

  function renderTab(label: string, href: string, actionsCount?: number) {
    return (
      <Link href={{ pathname: href, query: router.query }}>
        <a
          className={cn(styles.tabLink, {
            [styles.active]: router.asPath.indexOf(href) !== -1,
          })}
        >
          {label}
          {!!actionsCount && (
            <div className={styles.actionsCount}>
              {kFormatter(actionsCount ?? 0)}
            </div>
          )}
        </a>
      </Link>
    );
  }

  return (
    <div className={styles.root}>
      {accountId && renderTab(t('myFeed'), MY_FEED_URL, proposalActionsCount)}
      {renderTab(t('globalFeed'), ALL_FEED_URL)}
    </div>
  );
};

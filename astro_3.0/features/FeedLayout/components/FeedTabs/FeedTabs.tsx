import React, { FC } from 'react';
import Link from 'next/link';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import { ALL_FEED_URL, MY_FEED_URL } from 'constants/routing';

import styles from './FeedTabs.module.scss';

export const FeedTabs: FC = () => {
  const { t } = useTranslation();
  const router = useRouter();

  function renderTab(label: string, href: string) {
    return (
      <Link href={{ pathname: href, query: router.query }}>
        <a
          className={cn(styles.tabLink, {
            [styles.active]: router.asPath.indexOf(href) !== -1,
          })}
        >
          {label}
        </a>
      </Link>
    );
  }

  return (
    <div className={styles.root}>
      {renderTab(t('myFeed'), MY_FEED_URL)}
      {renderTab(t('globalFeed'), ALL_FEED_URL)}
    </div>
  );
};

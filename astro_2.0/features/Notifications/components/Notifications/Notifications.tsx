import React, { FC } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';

import { NotificationCard } from 'astro_2.0/components/NotificationCard';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { Icon } from 'components/Icon';
import { Loader } from 'components/loader';

import { PaginationResponse } from 'types/api';
import { Notification } from 'types/notification';
import { NotificationAction } from 'astro_2.0/features/Notifications/types';

import styles from './Notifications.module.scss';

interface NotificationsProps {
  daos?: string[];
  loading?: boolean;
  notifications: PaginationResponse<Notification[]> | null;
  loadMore: () => void;
  onRemove: NotificationAction;
  onUpdate: NotificationAction;
}

export const Notifications: FC<NotificationsProps> = ({
  notifications,
  loadMore,
  onRemove,
  onUpdate,
  loading = false,
}) => {
  const { t } = useTranslation('notificationsPage');

  if (loading) {
    return <Loader className={styles.loading} title={t('loading')} />;
  }

  if (!notifications?.data?.length) {
    return (
      <div className={styles.noNotiesContainer}>
        <Icon name="noNotifications" className={styles.noNotiesIcon} />
        <div>{t('noNotifications')}</div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.delimiter}>
        Total ({notifications.total})
        <div className={styles.line} />
      </div>
      <InfiniteScroll
        dataLength={notifications.data.length}
        next={loadMore}
        hasMore={notifications.data.length < notifications.total}
        loader={<Loader className={styles.loading} title={t('loading')} />}
        style={{ overflow: 'initial' }}
        endMessage={
          <div className={styles.loading}>
            <NoResultsView
              title={
                isEmpty(notifications?.data)
                  ? t('notifications.noArchivedNotifications')
                  : t('noMoreResults')
              }
            />
          </div>
        }
      >
        <AnimatePresence>
          {map(notifications.data, item => (
            <motion.div
              key={item.id}
              layout
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <NotificationCard
                key={item.id}
                regular={false}
                {...item}
                onUpdate={onUpdate}
                onRemove={onRemove}
                className={styles.notification}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </InfiniteScroll>
    </div>
  );
};

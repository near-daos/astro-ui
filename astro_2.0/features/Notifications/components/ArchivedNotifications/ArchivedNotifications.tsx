import React, { FC, useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAsyncFn, useMount, useMountedState } from 'react-use';
import { useTranslation } from 'next-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';

import { NotificationCard } from 'astro_2.0/components/NotificationCard';
import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { Icon } from 'components/Icon';
import { Loader } from 'components/loader';

import { Notification } from 'types/notification';
import { PaginationResponse } from 'types/api';

import { LIST_LIMIT_DEFAULT } from 'services/sputnik/constants';
import { NotificationsService } from 'services/NotificationsService';

import styles from './ArchivedNotifications.module.scss';

export const ArchivedNotifications: FC = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<PaginationResponse<
    Notification[]
  > | null>(null);
  const isMounted = useMountedState();

  const [{ loading }, fetchData] = useAsyncFn(async () => {
    let accumulatedListData = null;

    const res = await NotificationsService.getNotifications(true, {
      offset: notifications?.data.length || 0,
      limit: LIST_LIMIT_DEFAULT,
      sort: 'createdAt,DESC',
    });

    accumulatedListData = {
      ...res,
      data: [...(notifications?.data || []), ...res.data],
    };

    return accumulatedListData;
  }, [notifications?.data.length]);

  const loadMore = async () => {
    if (loading) {
      return;
    }

    const newNotificationsData = await fetchData();

    if (isMounted()) {
      setNotifications(newNotificationsData);
    }
  };

  useMount(() => {
    (() => loadMore())();
  });

  const handleRemove = useCallback(
    (id: string) => {
      const newData = notifications?.data.filter(item => item.id !== id);

      setNotifications({
        pageCount: notifications?.pageCount || 1,
        page: notifications?.page || 1,
        total: notifications?.total || 0,
        count: notifications?.count || 0,
        data: newData ?? [],
      });
    },
    [notifications]
  );

  if (!notifications) {
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
                onRemove={handleRemove}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </InfiniteScroll>
    </div>
  );
};

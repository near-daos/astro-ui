import cn from 'classnames';
import map from 'lodash/map';
import { isToday, parseISO } from 'date-fns';
import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { VFC, ReactNode, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { NOTIFICATIONS_SETTINGS_PAGE_URL } from 'constants/routing';

import { Notification } from 'types/notification';

import { useNotifications } from 'astro_2.0/features/Notifications';
import { ArchivedNotifications } from 'astro_2.0/features/Notifications/components/ArchivedNotifications';
import { NotificationCard } from 'astro_2.0/components/NotificationCard';
import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { SideFilter } from 'astro_2.0/components/SideFilter';

import styles from './NotificationsPage.module.scss';

interface NotificationsPageProps {
  accountDaosIds: string[];
  subscribedDaosIds: string[];
}

const NotificationsPage: VFC<NotificationsPageProps> = ({
  accountDaosIds,
  subscribedDaosIds,
}) => {
  const router = useRouter();
  const showArchived = router.query.notyType === 'archived';
  const showSubscribed = router.query.notyType === 'subscribed';
  const showYourDaos = router.query.notyType === 'yourDaos';
  const showAll = !router.query.notyType;
  const { notifications } = useNotifications();

  const { t } = useTranslation('notificationsPage');

  const [newNotifications, oldNotifications] = notifications.reduce<
    [Notification[], Notification[]]
  >(
    (res, item) => {
      if (isToday(parseISO(item.createdAt))) {
        res[0].push(item);
      } else {
        res[1].push(item);
      }

      return res;
    },
    [[], []]
  );

  const gotToSettingsPage = useCallback(() => {
    router.push(NOTIFICATIONS_SETTINGS_PAGE_URL);
  }, [router]);

  const filterOptions = useMemo(() => {
    const keys = ['yourDaos', 'subscribed', 'archived'];

    return keys.map(key => ({
      label: t(key),
      value: key,
    }));
  }, [t]);

  function renderDelimiter(title: string, count: number, tail?: ReactNode) {
    return (
      <div className={styles.delimiter}>
        {title} ({count})
        <div className={styles.line} />
        {tail}
      </div>
    );
  }

  function renderNoNotifications(message: string, isBig = false) {
    const iconClassName = cn(styles.noNotiesIcon, {
      [styles.big]: isBig,
    });

    return (
      <div className={styles.noNotiesContainer}>
        <Icon name="noNotifications" className={iconClassName} />
        <div>{message}</div>
      </div>
    );
  }

  function renderNotifications(title: string | null, noties?: Notification[]) {
    if (isEmpty(noties) || !noties) {
      return null;
    }

    return (
      <>
        {title && renderDelimiter(title, noties.length)}
        <div>
          <AnimatePresence>
            {map(noties, item => (
              <motion.div
                key={item.id}
                layout
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <NotificationCard key={item.id} regular={false} {...item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </>
    );
  }

  function renderNotificationsList(daosIds?: string[]) {
    let newNoties;
    let oldNoties;

    if (!daosIds) {
      newNoties = newNotifications;
      oldNoties = oldNotifications;
    } else {
      newNoties = newNotifications?.filter(item =>
        daosIds.includes(item.daoId)
      );

      oldNoties = oldNotifications?.filter(item =>
        daosIds.includes(item.daoId)
      );
    }

    if (!newNoties.length && !oldNoties.length) {
      return renderNoNotifications(t('noNotifications'));
    }

    return (
      <>
        {renderNotifications(t('newNotifications'), newNoties)}
        {renderNotifications(t('oldNotifications'), oldNoties)}
      </>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.headerContainer}>
        <h1 className={styles.header}>{t('notificationsHub')}</h1>
        <Button
          size="small"
          variant="secondary"
          onClick={gotToSettingsPage}
          className={styles.settingButton}
        >
          <Icon name="stateGear" className={styles.gearIcon} />
          <div className={styles.buttonLabel}>{t('settings')}</div>
        </Button>
      </div>
      <div className={styles.pageContent}>
        <SideFilter
          queryName="notyType"
          list={filterOptions}
          title={t('chooseAType')}
          className={styles.sideFilter}
        />
        <div className={styles.notifications}>
          {showAll && renderNotificationsList()}
          {showYourDaos && renderNotificationsList(accountDaosIds)}
          {showSubscribed && renderNotificationsList(subscribedDaosIds)}
          {showArchived && <ArchivedNotifications />}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;

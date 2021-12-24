import cn from 'classnames';
import map from 'lodash/map';
import { isToday, parseISO } from 'date-fns';
import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { VFC, ReactNode, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { NOTIFICATIONS_SETTINGS_PAGE_URL } from 'constants/routing';

import { Notification, NotifiedActionType } from 'types/notification';

import { useNotifications } from 'astro_2.0/features/Notifications';

import { NotificationCard } from 'astro_2.0/components/NotificationCard';
import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { SideFilter } from 'astro_2.0/components/SideFilter';

import styles from './NotificationsPage.module.scss';

interface NotificationsPageProps {
  accountDaosIds: string[];
}

const NotificationsPage: VFC<NotificationsPageProps> = ({ accountDaosIds }) => {
  const router = useRouter();
  const showArchived = router.query.notyType === 'archived';
  const { notifications, archivedNotifications } = useNotifications();

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
    const keys = ['yourDaos', 'platform', 'archived'];

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
      return (
        <>
          {title && renderDelimiter(title, noties?.length ?? 0)}
          {renderNoNotifications(t('noNotifications'))}
        </>
      );
    }

    const filter = router.query.notyType;

    let resultList: Notification[];

    if (filter === 'platform') {
      const platformTypes = [
        NotifiedActionType.CustomDao,
        NotifiedActionType.ClubDao,
        NotifiedActionType.FoundationDao,
        NotifiedActionType.CorporationDao,
        NotifiedActionType.CooperativeDao,
      ];

      resultList = noties?.filter(item => platformTypes.includes(item.type));
    } else if (filter === 'archived') {
      resultList = noties?.filter(item => item.isArchived);
    } else if (filter === 'yourDaos') {
      resultList = noties?.filter(item => accountDaosIds.includes(item.daoId));
    } else {
      resultList = noties;
    }

    return (
      <>
        {title && renderDelimiter(title, resultList.length)}
        <div>
          {resultList.length ? (
            <AnimatePresence>
              {map(resultList, item => (
                <motion.div
                  key={item.id}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <NotificationCard key={item.id} regular={false} {...item} />
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            renderNoNotifications(t('noNotifications'))
          )}
        </div>
      </>
    );
  }

  function renderArchivedNotifications() {
    if (isEmpty(archivedNotifications)) {
      return renderNoNotifications(t('noNotifications'));
    }

    return renderNotifications(null, archivedNotifications);
  }

  function renderAllNotifications() {
    if (isEmpty(newNotifications) && isEmpty(oldNotifications)) {
      return renderNoNotifications(t('noNotifications'));
    }

    return (
      <>
        {renderNotifications(t('newNotifications'), newNotifications)}
        {renderNotifications(t('oldNotifications'), oldNotifications)}
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
          {showArchived
            ? renderArchivedNotifications()
            : renderAllNotifications()}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;

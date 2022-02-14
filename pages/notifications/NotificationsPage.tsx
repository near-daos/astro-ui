import cn from 'classnames';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { VFC, useCallback, useMemo } from 'react';

import { NOTIFICATIONS_SETTINGS_PAGE_URL } from 'constants/routing';

import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { SideFilter } from 'astro_2.0/components/SideFilter';
import { Notifications } from 'astro_2.0/features/Notifications/components/Notifications';
import { useNotificationsList } from 'astro_2.0/features/Notifications/hooks';

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

  const {
    handleUpdateAll,
    notifications,
    loadMore,
    handleUpdate,
    handleRemove,
  } = useNotificationsList(accountDaosIds, subscribedDaosIds);

  const { t } = useTranslation('notificationsPage');

  const gotToSettingsPage = useCallback(() => {
    router.push({
      pathname: NOTIFICATIONS_SETTINGS_PAGE_URL,
      query: {
        notyType: 'yourDaos',
      },
    });
  }, [router]);

  const filterOptions = useMemo(() => {
    const keys = ['yourDaos', 'subscribed', 'archived'];

    return keys.map(key => ({
      label: t(key),
      value: key,
    }));
  }, [t]);

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
          <div className={styles.controls}>
            <Button
              onClick={() => handleUpdateAll('READ')}
              variant="tertiary"
              className={styles.controlButton}
              size="small"
            >
              <Icon name="noteCheck" className={styles.buttonIcon} />
              {t('markReadAll')}
            </Button>
            <Button
              disabled={showArchived}
              onClick={() => handleUpdateAll('ARCHIVE')}
              variant="tertiary"
              className={styles.controlButton}
              size="small"
            >
              {t('archiveAll')}
              <Icon
                name="noteArchive"
                className={cn(styles.buttonIcon, styles.archiveIcon)}
              />
            </Button>
          </div>
          <Notifications
            onUpdate={handleUpdate}
            loadMore={loadMore}
            notifications={notifications}
            onRemove={handleRemove}
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;

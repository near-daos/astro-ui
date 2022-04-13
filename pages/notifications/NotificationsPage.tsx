import cn from 'classnames';
import { VFC, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

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

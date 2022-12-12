import React, { FC, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useNotificationsList } from 'astro_2.0/features/Notifications/hooks';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';
import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import cn from 'classnames';
import { SideFilter } from 'astro_2.0/components/SideFilter';
import { Notifications } from 'astro_2.0/features/Notifications/components/Notifications';

import { UserContacts } from 'services/NotificationsService/types';

import styles from './NotificationsPageView.module.scss';

interface Props {
  config: UserContacts;
}

export const NotificationsPageView: FC<Props> = ({ config }) => {
  const router = useRouter();
  const showArchived = router.query.notyType === 'archived';

  const {
    handleUpdateAll,
    notifications,
    loadMore,
    loading,
    handleUpdate,
    handleRemove,
  } = useNotificationsList();

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
      <Head>
        <title>Notifications</title>
      </Head>

      <div className={styles.headerContainer}>
        <h1 className={styles.header}>{t('notificationsHub')}</h1>

        {config.accountId &&
          (!config.isPhoneVerified || !config.isEmailVerified) && (
            <div className={styles.headerCTA}>
              <Link href="/my-account">Connect Email/Phone</Link>
            </div>
          )}
      </div>

      <div className={styles.controls}>
        <Button
          onClick={() => handleUpdateAll('READ')}
          variant="tertiary"
          className={styles.controlButton}
          size="small"
        >
          <Icon name="noteCheckDouble" className={styles.buttonIcon} />
          {t('markReadAll')}
        </Button>

        <Button
          disabled={showArchived}
          onClick={() => handleUpdateAll('ARCHIVE')}
          variant="tertiary"
          className={styles.controlButton}
          size="small"
        >
          <Icon
            name="noteArchive"
            className={cn(styles.buttonIcon, styles.archiveIcon)}
          />
          {t('archiveAll')}
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
          <Notifications
            loading={loading}
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

export default NotificationsPageView;

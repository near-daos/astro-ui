import cn from 'classnames';
import React, { useMemo, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';

import { UserContacts } from 'services/NotificationsService/types';

import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { SideFilter } from 'astro_2.0/components/SideFilter';
import { Notifications } from 'astro_2.0/features/Notifications/components/Notifications';
import { useNotificationsList } from 'astro_2.0/features/Notifications/hooks';

import Link from 'next/link';

import { MainLayout } from 'astro_3.0/features/MainLayout';

import { Page } from 'pages/_app';

import styles from './NotificationsPage.module.scss';

export interface NotificationsPageProps {
  config: UserContacts;
}

const NotificationsPage: Page<NotificationsPageProps> = ({ config }) => {
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

NotificationsPage.getLayout = function getLayout(page: ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default NotificationsPage;

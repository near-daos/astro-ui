import cn from 'classnames';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { VFC, ReactNode, useCallback, useMemo } from 'react';

import { NOTIFICATIONS_SETTINGS_PAGE_URL } from 'constants/routing';

import { PaginationResponse } from 'types/api';
import { Notification } from 'types/notification';

import { useNotifications } from 'astro_2.0/features/Notifications';

import { NotificationCard } from 'astro_2.0/components/NotificationCard';
import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { SideFilter } from 'astro_2.0/components/SideFilter';

import styles from './NotificationsPage.module.scss';

interface NotificationsPageProps {
  notifications: PaginationResponse<Notification[]>;
}

const NotificationsPage: VFC<NotificationsPageProps> = () => {
  const router = useRouter();
  const { notifications } = useNotifications();

  const { t } = useTranslation('notificationsPage');

  // TODO - how to split them???
  const newNotifications = notifications;
  const oldNotifications: Notification[] = [];

  const gotToSettingsPage = useCallback(() => {
    router.push(NOTIFICATIONS_SETTINGS_PAGE_URL);
  }, [router]);

  const filterOptions = useMemo(() => {
    const keys = ['yourDaos', 'platform', 'muted'];

    return keys.map(key => ({
      label: t(key),
      value: key,
    }));
  }, [t]);

  function renderDelimiter(title: string, tail?: ReactNode) {
    return (
      <div className={styles.delimiter}>
        {title}
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

  function renderNotifications(noties?: Notification[]) {
    if (isEmpty(noties)) {
      return renderNoNotifications(t('noNotifications'));
    }

    return (
      <div>
        {map(noties, item => (
          <NotificationCard key={item.id} regular={false} {...item} />
        ))}
      </div>
    );
  }

  function renderAllNotifications() {
    if (isEmpty(newNotifications) && isEmpty(oldNotifications)) {
      return renderNoNotifications(t('noNotificationsYet'), true);
    }

    return (
      <>
        {renderDelimiter(t('newNotifications'))}
        {renderNotifications(newNotifications)}
        {renderDelimiter(t('oldNotifications'))}
        {renderNotifications(oldNotifications)}
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
        <div className={styles.notifications}>{renderAllNotifications()}</div>
      </div>
    </div>
  );
};

export default NotificationsPage;

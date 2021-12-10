import cn from 'classnames';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import { VFC, ReactNode, useCallback } from 'react';

import { NOTIFICATIONS_SETTINGS_PAGE_URL } from 'constants/routing';

import {
  NotificationCard,
  NotificationCardProps,
} from 'astro_2.0/components/NotificationCard';
import { Icon } from 'components/Icon';
import { Button } from 'components/button/Button';
import { SideFilter } from 'astro_2.0/components/SideFilter';

import { getNotifications } from 'mocks/notificationsMock';

import styles from './NotificationsPage.module.scss';

const filterOptions = [
  {
    label: 'Your DAOs',
    value: 'yourDaos',
  },
  {
    label: 'Platform',
    value: 'platform',
  },
  {
    label: 'Muted',
    value: 'muted',
  },
];

const NotificationsPage: VFC = () => {
  const router = useRouter();

  const newNotifications = getNotifications(10, true, false, true);
  const oldNotifications = getNotifications(10, false, false, false);

  const gotToSettingsPage = useCallback(() => {
    router.push(NOTIFICATIONS_SETTINGS_PAGE_URL);
  }, [router]);

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

  function renderNotifications(notifications?: NotificationCardProps[]) {
    if (isEmpty(notifications)) {
      return renderNoNotifications('No notifications');
    }

    return (
      <div>
        {map(notifications, item => (
          <NotificationCard {...item} />
        ))}
      </div>
    );
  }

  function renderAllNotifications() {
    if (isEmpty(newNotifications) && isEmpty(oldNotifications)) {
      return renderNoNotifications('No notifications yet!', true);
    }

    return (
      <>
        {renderDelimiter('New')}
        {renderNotifications(newNotifications)}
        {renderDelimiter('Old')}
        {renderNotifications(oldNotifications)}
      </>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.headerContainer}>
        <h1 className={styles.header}>Notifications Hub</h1>
        <Button
          size="small"
          variant="secondary"
          onClick={gotToSettingsPage}
          className={styles.settingButton}
        >
          <Icon name="stateGear" className={styles.gearIcon} />
          <div className={styles.buttonLabel}>Settings</div>
        </Button>
      </div>
      <div className={styles.pageContent}>
        <SideFilter
          queryName="notyType"
          list={filterOptions}
          title="Choose a type"
          className={styles.sideFilter}
        />
        <div className={styles.notifications}>{renderAllNotifications()}</div>
      </div>
    </div>
  );
};

export default NotificationsPage;

import { forwardRef } from 'react';
import Link from 'next/link';

import { NotificationCard } from 'astro_2.0/components/NotificationCard';

import { Notification } from 'types/notification';

import styles from './NotificationsDropdown.module.scss';

interface NotificationsDropdownProps {
  notifications: Notification[];
}

export const NotificationsDropdown = forwardRef<
  HTMLDivElement,
  NotificationsDropdownProps
>((props, ref) => {
  const { notifications } = props;

  function renderNoties() {
    return notifications.map(noty => (
      <NotificationCard {...noty} key={noty.id} />
    ));
  }

  return (
    <div ref={ref} className={styles.root}>
      <div className={styles.header}>
        <div>New</div>
      </div>
      <div className={styles.noties}>{renderNoties()}</div>
      <div className={styles.divider} />
      <div className={styles.footer}>
        <Link href="/notifications" passHref>
          <a>Show all ({notifications?.length || ''})</a>
        </Link>
      </div>
    </div>
  );
});

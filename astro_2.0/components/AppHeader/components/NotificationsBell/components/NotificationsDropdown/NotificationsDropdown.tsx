import { forwardRef } from 'react';

import { NotificationCard } from 'astro_2.0/components/NotificationCard';

import { getNotifications } from 'mocks/notificationsMock';

import styles from './NotificationsDropdown.module.scss';

interface NotificationsDropdownProps {
  notifications: unknown[];
}

export const NotificationsDropdown = forwardRef<
  HTMLDivElement,
  NotificationsDropdownProps
>((props, ref) => {
  const { notifications } = props;

  function renderNoties(isNew: boolean) {
    const noties = getNotifications(notifications.length, isNew);

    return noties.map(noty => (
      <NotificationCard {...noty} key={noty.content.id} />
    ));
  }

  function renderShowAll() {
    const { length } = notifications;

    return length > 4 ? `Show all (${length})` : null;
  }

  return (
    <div ref={ref} className={styles.root}>
      <div className={styles.header}>
        <div>New</div>
      </div>
      <div className={styles.noties}>{renderNoties(true)}</div>
      <div className={styles.divider} />
      <div className={styles.footer}>{renderShowAll()}</div>
    </div>
  );
});

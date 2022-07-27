import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import uniqBy from 'lodash/uniqBy';

import { configService } from 'services/ConfigService';

import { useSocket } from 'context/SocketContext';
import { mapNotificationDtoToNotification } from 'services/NotificationsService/mappers/notification';
import { Notification, NotificationDTO } from 'types/notification';

import { NOTIFICATIONS_PAGE_URL } from 'constants/routing';

import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import { AnimatedNotification } from 'astro_2.0/components/AppHeader/components/NotificationsBell/components/NotificationsToastsContainer/AnimatedNotification';

import styles from './NotificationsToastsContainer.module.scss';

export const NotificationsToastsContainer: FC = () => {
  const noties = useRef<{ timestamp: number; notification: Notification }[]>(
    []
  );
  const [showAllButton, setShowAllButton] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { socket } = useSocket();
  const { appConfig } = configService.get();

  useEffect(() => {
    if (socket) {
      socket.on('account-notification', (notification: NotificationDTO) => {
        noties.current = uniqBy(
          [
            {
              timestamp: new Date().getTime(),
              notification: mapNotificationDtoToNotification([notification])[0],
            },
            ...noties.current,
          ],
          item => item.notification.id
        );
      });
    }
  }, [socket]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      noties.current = noties.current.filter(noty => {
        const { timestamp } = noty;

        return (
          new Date().getTime() - timestamp <
          (appConfig?.TOASTS_NOTIFICATIONS_TIMEOUT
            ? Number(appConfig.TOASTS_NOTIFICATIONS_TIMEOUT)
            : 20000)
        );
      });

      let newList = noties.current
        .map(item => item.notification)
        .filter(item => !item.isRead);

      if (newList.length > 2) {
        setShowAllButton(true);

        newList = newList.slice(0, 2);
      }

      setNotifications(newList);
    }, 500);

    return () => clearInterval(intervalId);
  }, [appConfig?.TOASTS_NOTIFICATIONS_TIMEOUT]);

  const handleMarkRead = useCallback((id: string) => {
    noties.current = noties.current.filter(noty => noty.notification.id !== id);
  }, []);

  function renderNotifications() {
    return notifications.map(notification => {
      return (
        <AnimatedNotification
          key={notification.id}
          notification={notification}
          onMarkRead={handleMarkRead}
          className={styles.notificationCardWrapper}
        />
      );
    });
  }

  return (
    <div className={styles.root}>
      <AnimatePresence>{renderNotifications()}</AnimatePresence>
      <AnimatePresence>
        {showAllButton && (
          <motion.div
            layout
            className={styles.notificationCardWrapper}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Button
              className={styles.showAllButton}
              variant="tertiary"
              size="block"
              onClick={() => {
                setTimeout(() => {
                  setShowAllButton(false);
                });
              }}
            >
              <Link href={NOTIFICATIONS_PAGE_URL}>
                <a>Read all new notifications</a>
              </Link>
              <Icon name="buttonArrowRight" className={styles.icon} />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

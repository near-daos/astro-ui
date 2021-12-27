import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import uniqBy from 'lodash/uniqBy';
import { appConfig } from 'config';
import { useSwipeable } from 'react-swipeable';

import { useSocket } from 'context/SocketContext';
import { mapNotificationDtoToNotification } from 'services/NotificationsService/mappers/notification';
import { Notification, NotificationDTO } from 'types/notification';

import { NotificationCard } from 'astro_2.0/components/NotificationCard';

import styles from './NotificationsToastsContainer.module.scss';

export const NotificationsToastsContainer: FC = () => {
  const noties = useRef<{ timestamp: number; notification: Notification }[]>(
    []
  );
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('account-notification', (notification: NotificationDTO) => {
        noties.current = uniqBy(
          [
            ...noties.current,
            {
              timestamp: new Date().getTime(),
              notification: mapNotificationDtoToNotification([notification])[0],
            },
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
          (appConfig.toastsNotificationsTimeout
            ? Number(appConfig.toastsNotificationsTimeout)
            : 20000)
        );
      });
      setNotifications(
        noties.current
          .map(item => item.notification)
          .filter(item => !item.isRead)
      );
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleMarkRead = useCallback((id: string) => {
    noties.current = noties.current.filter(noty => noty.notification.id !== id);
  }, []);

  const handlers = useSwipeable({
    onSwiped: eventData => {
      if (eventData.dir !== 'Right' && eventData.dir !== 'Left') {
        return;
      }

      const { target } = eventData.event;

      if (target) {
        const wrapper = (target as HTMLElement)?.closest(
          `.${styles.notificationCardWrapper}`
        );

        if (wrapper && wrapper.getAttribute) {
          const notificationId = wrapper?.getAttribute('id');

          if (notificationId) {
            handleMarkRead(notificationId);
          }
        }
      }
    },
  });

  function renderNotifications() {
    return notifications.map(props => {
      return (
        <motion.div
          key={props.id}
          layout
          id={props.id}
          className={styles.notificationCardWrapper}
          initial={{ opacity: 0, transform: 'translateX(150px)' }}
          animate={{ opacity: 1, transform: 'translateX(0px)' }}
          exit={{ opacity: 0 }}
        >
          <NotificationCard {...props} onMarkRead={handleMarkRead} />
        </motion.div>
      );
    });
  }

  return (
    <div className={styles.root} {...handlers}>
      <AnimatePresence>{renderNotifications()}</AnimatePresence>
    </div>
  );
};

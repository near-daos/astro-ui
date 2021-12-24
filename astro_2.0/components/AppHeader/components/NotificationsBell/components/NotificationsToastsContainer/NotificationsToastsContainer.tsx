import React, { FC, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

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
        noties.current = [
          ...noties.current,
          {
            timestamp: new Date().getTime(),
            notification: mapNotificationDtoToNotification([notification])[0],
          },
        ];
      });
    }
  }, [socket]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      noties.current = noties.current.filter(noty => {
        const { timestamp } = noty;

        return new Date().getTime() - timestamp < 20000;
      });
      setNotifications(noties.current.map(item => item.notification));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  function renderNotifications() {
    return notifications.map(props => {
      return (
        <motion.div
          key={props.id}
          layout
          initial={{ opacity: 0, transform: 'translateX(150px)' }}
          animate={{ opacity: 1, transform: 'translateX(0px)' }}
          exit={{ opacity: 0 }}
        >
          <NotificationCard {...props} />
        </motion.div>
      );
    });
  }

  return (
    <div className={styles.root}>
      <AnimatePresence>{renderNotifications()}</AnimatePresence>
    </div>
  );
};

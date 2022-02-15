import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import uniqBy from 'lodash/uniqBy';
import { useSwipeable } from 'react-swipeable';

import { configService } from 'services/ConfigService';

import { useSocket } from 'context/SocketContext';
import { mapNotificationDtoToNotification } from 'services/NotificationsService/mappers/notification';
import { Notification, NotificationDTO } from 'types/notification';

import { NOTIFICATIONS_PAGE_URL } from 'constants/routing';

import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';
import { NotificationCard } from 'astro_2.0/components/NotificationCard';

import styles from './NotificationsToastsContainer.module.scss';

export const NotificationsToastsContainer: FC = () => {
  const noties = useRef<{ timestamp: number; notification: Notification }[]>(
    []
  );
  const [showAllButton, setShowAllButton] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { socket } = useSocket();
  const config = configService.get();

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
          (config?.TOASTS_NOTIFICATIONS_TIMEOUT
            ? Number(config.TOASTS_NOTIFICATIONS_TIMEOUT)
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
    }, 1000);

    return () => clearInterval(intervalId);
  }, [config?.TOASTS_NOTIFICATIONS_TIMEOUT]);

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
          <NotificationCard {...props} onUpdate={handleMarkRead} regular />
        </motion.div>
      );
    });
  }

  return (
    <div className={styles.root} {...handlers}>
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

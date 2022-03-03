import React, { FC, useEffect } from 'react';
import styles from 'astro_2.0/components/AppHeader/components/NotificationsBell/components/NotificationsToastsContainer/NotificationsToastsContainer.module.scss';
import { NotificationCard } from 'astro_2.0/components/NotificationCard';
import { motion, useAnimation } from 'framer-motion';
import { Notification } from 'types/notification';
import { useSwipeable } from 'react-swipeable';

interface AnimatedNotificationProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  className?: string;
}

const variants = {
  right: { opacity: 0, transform: 'translateX(100%)' },
  left: { opacity: 0, transform: 'translateX(-100%)' },
  visible: {
    opacity: 1,
    transform: 'translateX(0px)',
  },
  exit: { opacity: 0 },
};

export const AnimatedNotification: FC<AnimatedNotificationProps> = ({
  notification,
  onMarkRead,
  className,
}) => {
  const controls = useAnimation();

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
            controls.start(eventData.dir === 'Right' ? 'right' : 'left');
            onMarkRead(notificationId);
          }
        }
      }
    },
  });

  useEffect(() => {
    controls.start('visible');

    return () => {
      controls.stop();
    };
  }, [controls]);

  return (
    <motion.div
      key={notification.id}
      layout
      id={notification.id}
      className={className}
      initial={variants.right}
      animate={controls}
      variants={variants}
      exit={variants.exit}
      {...handlers}
    >
      <NotificationCard {...notification} onUpdate={onMarkRead} regular />
    </motion.div>
  );
};

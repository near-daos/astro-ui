import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import {
  SHOW_NOTIFICATION_EVENT,
  HIDE_NOTIFICATION_EVENT,
  HIDE_NOTIFICATION_EVENT_BY_TAG,
} from 'constants/common';
import { Notification } from 'features/notifications/Notification';

import {
  HideNotificationEvent,
  HideNotificationByTagEvent,
  NotificationProps,
  ShowNotificationEvent,
} from 'features/notifications/types';

import s from './NotificationContainer.module.scss';

const emptyArray: NotificationProps[] = [];

export const NotificationContainer: React.FC = () => {
  const noties = React.useRef<NotificationProps[]>([]);
  const idStorage = React.useRef<number>(0);

  const [styles, setStyles] = useState({});
  const [notifications, setNotifications] =
    React.useState<NotificationProps[]>(emptyArray);

  useEffect(() => {
    function addNotification(e: ShowNotificationEvent) {
      const noty = {
        ...e.detail,
        id: idStorage.current.toString(),
        timestamp: new Date().getTime(),
      };

      idStorage.current += 1;

      noties.current = noties.current.concat(noty);
    }

    document.addEventListener(
      SHOW_NOTIFICATION_EVENT,
      addNotification as EventListener
    );

    return () =>
      document.removeEventListener(
        SHOW_NOTIFICATION_EVENT,
        addNotification as EventListener
      );
  }, []);

  useEffect(() => {
    function removeNotification(e: HideNotificationEvent) {
      const { id } = e.detail;

      noties.current = noties.current.filter(noty => noty.id !== id);
    }

    function removeNotificationByTag(e: HideNotificationByTagEvent) {
      const { tag } = e.detail;

      noties.current = noties.current.filter(noty => noty.tag !== tag);
    }

    document.addEventListener(
      HIDE_NOTIFICATION_EVENT,
      removeNotification as EventListener
    );

    document.addEventListener(
      HIDE_NOTIFICATION_EVENT_BY_TAG,
      removeNotificationByTag as EventListener
    );

    return () => {
      document.removeEventListener(
        HIDE_NOTIFICATION_EVENT,
        removeNotification as EventListener
      );

      document.removeEventListener(
        HIDE_NOTIFICATION_EVENT_BY_TAG,
        removeNotificationByTag as EventListener
      );
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      noties.current = noties.current.filter(noty => {
        const { lifetime, timestamp } = noty;

        return !lifetime || new Date().getTime() - timestamp < lifetime;
      });
      setNotifications(noties.current);
    }, 100);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    function onScroll() {
      setStyles({
        top: 16,
      });
    }

    onScroll();

    const debouncedOnScroll = debounce(onScroll, 10);

    document.body.addEventListener('scroll', debouncedOnScroll);

    return () => document.body.removeEventListener('scroll', debouncedOnScroll);
  }, []);

  function renderNotifications() {
    return notifications.map(noty => {
      const { id } = noty;

      return <Notification {...noty} key={id} />;
    });
  }

  return (
    <div className={s.body} style={styles}>
      {renderNotifications()}
    </div>
  );
};

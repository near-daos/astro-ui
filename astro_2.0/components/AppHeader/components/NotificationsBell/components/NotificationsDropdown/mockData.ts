import times from 'lodash/times';

import { NotificationCardContent } from 'astro_2.0/components/NotificationCard/types';

import { NotificationCardProps } from 'astro_2.0/components/NotificationCard';

import { NotificationStatus, NotificationType } from 'types/notification';

function getFromArray<T>(array: T[], index: number): T {
  const { length } = array;
  const i = index >= length ? index % length : index;

  return array[i];
}

function getContent(index: number): NotificationCardContent {
  const notificationTypes = Object.values(NotificationType);
  const statuses = Object.values(NotificationStatus);

  return {
    id: index.toString(),
    type: getFromArray(notificationTypes, index),
    status: getFromArray(statuses, index),
    text: `Hello World ${index}`,
    time: new Date().toISOString(),
  };
}

export function getNotifications(
  amount: number,
  isNew: boolean,
  regular = true,
  isMuteAvailable = true
): NotificationCardProps[] {
  return times(amount, index => {
    return {
      isNew,
      isRead: !isNew,
      isMuted: false,
      regular,
      content: getContent(index),
      isMuteAvailable,
      isMarkReadAvailable: isNew,
      isDeleteAvailable: true,
      markReadHandler: () => {
        // eslint-disable-next-line no-console
        console.log('>>> markReadHandler');
      },
      toggleMuteHandler: () => {
        // eslint-disable-next-line no-console
        console.log('>>> toggleMuteHandler');
      },
      deleteHandler: () => {
        // eslint-disable-next-line no-console
        console.log('>>> deleteHandler');
      },
    };
  });
}

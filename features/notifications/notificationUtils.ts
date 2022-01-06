import { dispatchCustomEvent } from 'utils/dispatchCustomEvent';

import {
  SHOW_NOTIFICATION_EVENT,
  HIDE_NOTIFICATION_EVENT,
  HIDE_NOTIFICATION_EVENT_BY_TAG,
} from './notificationConstants';

import { NotificationRawData } from './types';

export function showNotification(noty: NotificationRawData): void {
  dispatchCustomEvent(SHOW_NOTIFICATION_EVENT, noty);
}

export function hideNotificationId(id: string): void {
  dispatchCustomEvent(HIDE_NOTIFICATION_EVENT, { id });
}

export function hideNotificationByTag(tag: string): void {
  dispatchCustomEvent(HIDE_NOTIFICATION_EVENT_BY_TAG, { tag });
}
